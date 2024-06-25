import * as vscode from 'vscode';
import { getSearchHistory } from './getSearchHistory';
import path from 'path';

export class SearchHistoryProvider implements vscode.TreeDataProvider<string> {

    private _onDidChangeTreeData: vscode.EventEmitter<string | undefined> = new vscode.EventEmitter<string | undefined>();
    readonly onDidChangeTreeData: vscode.Event<string | undefined> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
    }

    refresh(): any {
        this._onDidChangeTreeData.fire(undefined);
    }

    async getChildren(key: string | undefined): Promise<string[]> {
        if (key) {
            return [];
        }

        const workspaceStorage = this.context.storageUri?.fsPath;
        if (!workspaceStorage) {
            return [];
        }
        const workspaceStoragePath = path.parse(workspaceStorage).dir;
        const dbPath = path.join(workspaceStoragePath, 'state.vscdb');
        if (dbPath) {
            try {
                const value = await getSearchHistory(dbPath);
                if (value && value.search) {
                    return value.search;
                }
            } catch (err) {
                console.error(err);
            };
        }
        return [];
    }

    getTreeItem(key: string): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(key);
        treeItem.id = key;
        return treeItem;
    }
}
