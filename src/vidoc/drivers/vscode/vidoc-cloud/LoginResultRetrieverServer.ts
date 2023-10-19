import { exec } from "child_process";
import * as http from "http";
import * as url from "url";

export class LoginResultRetrieverServer {
  private server: http.Server | null;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.server = null;
  }

  async waitForTokenResponse(
    timeoutSeconds: number
  ): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req: any, res: any) => {
        if (req.url) {
          const parsedUrl = url.parse(req.url, true);
          const token = parsedUrl.query.token as string;

          if (token) {
            resolve(token);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(
              "Received token successfully. You can close this window/tab."
            );
            if (this.server) {
              this.server.close();
            }
          } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end(
              "Token not provided. Ensure that the callback URL contains the token."
            );
          }
        }
      });

      this.server.listen(this.port, () => {
        console.log(`Server listening on http://localhost:${this.port}`);
      });

      setTimeout(() => {
        if (this.server) {
          this.server.close();
        }
        reject(new Error("Token retrieval timed out"));
      }, timeoutSeconds * 1000);
    });
  }
}
