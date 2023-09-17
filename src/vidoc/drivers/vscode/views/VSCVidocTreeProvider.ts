import * as vscode from 'vscode';
import { inject, injectable } from 'tsyringe';
import { VidocRepository } from '../../../interfaces/VidocRepository';

@injectable()
export class VSCVidocTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | null> = new vscode.EventEmitter<TreeItem | null>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | null> = this._onDidChangeTreeData.event;

  constructor(
    @inject("VidocRepository") private vidocRepository: VidocRepository
  ) {}

  async refresh(): Promise<void> {
    this._onDidChangeTreeData.fire(null);
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      // Fetch Vidocs and return as root level items
      const vidocs = await this.vidocRepository.getAllVidocs();
      return vidocs.map(vidoc => new TreeItem(vidoc.id, vscode.TreeItemCollapsibleState.None, vidoc.id, {
        command: 'workbench.action.findInFiles',
        title: '',
        arguments: [{
          query: `:vidoc ${vidoc.id}`,
          triggerSearch: true,
          useExcludeSettingsAndIgnoreFiles: true,
          isRegex: false,
          isCaseSensitive: true,
          matchWholeWord: true
        }]
      }));
    } else {
      return []; // no child items
    }
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly vidocId?: string,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
  }
}
