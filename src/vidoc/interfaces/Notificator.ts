
export interface Notificator {
    warn(message: string): void;
    error(message: string): void;
    success(message: string): void;
    info(message: string): void;
}