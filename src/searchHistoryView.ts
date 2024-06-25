import * as vscode from 'vscode';
import { getSearchHistory } from './getSearchHistory';
import path from 'path';

export class searchHistoryView {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        const view = vscode.window.createTreeView('searchLog', { treeDataProvider: this.searchHistoryDataProvider(context), showCollapseAll: true });
        context.subscriptions.push(view);
        this.context = context;
    }

    searchHistoryDataProvider(context: vscode.ExtensionContext): vscode.TreeDataProvider<string> {
        return {
            getChildren: async (element: string): Promise<string[]> => {
                return this.getChildren(element ? element : undefined);
            },
            getTreeItem: (element: string): vscode.TreeItem => {
                const treeItem = this.getTreeItem(element);
                return treeItem;
            },
            getParent: (key: string): string | undefined => {
                return undefined;
            }
        };
    }

    refresh(): any {
        // this._onDidChangeTreeData.fire(undefined);
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
