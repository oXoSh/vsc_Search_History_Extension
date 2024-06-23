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

// const tree: any = {
//     'a': {
//         'aa': {
//             'aaa': {
//                 'aaaa': {
//                     'aaaaa': {
//                         'aaaaaa': {

//                         }
//                     }
//                 }
//             }
//         },
//         'ab': {}
//     },
//     'b': {
//         'ba': {},
//         'bb': {}
//     }
// };
// const nodes: any = {};

// function searchHistoryDataProvider(context: vscode.ExtensionContext): vscode.TreeDataProvider<{ key: string }> {
//     return {
//         getChildren: (element: { key: string }): { key: string }[] => {
//             return getChildren(element ? element.key : undefined).map(key => getNode(key));
//         },
//         getTreeItem: (element: { key: string }): vscode.TreeItem => {
//             const treeItem = getTreeItem(element.key);
//             treeItem.id = element.key;
//             return treeItem;
//         },
//         getParent: ({ key }: { key: string }): { key: string } | undefined => {
//             const parentKey = key.substring(0, key.length - 1);
//             return parentKey ? new Key(parentKey) : undefined;
//         }
//     };
// }

// function getChildren(key: string | undefined): string[] {
//     if (!key) {
//         return Object.keys(tree);
//     }
//     const treeElement = getTreeElement(key);
//     if (treeElement) {
//         return Object.keys(treeElement);
//     }
//     return [];
// }

// function getTreeItem(key: string): vscode.TreeItem {
//     const treeElement = getTreeElement(key);
//     // An example of how to use codicons in a MarkdownString in a tree item tooltip.
//     const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
//     return {
//         label: /**vscode.TreeItemLabel**/<any>{ label: key, highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 },
//         tooltip,
//         collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
//     };
// }

// function getTreeElement(element: string): any {
//     let parent = tree;
//     for (let i = 0; i < element.length; i++) {
//         parent = parent[element.substring(0, i + 1)];
//         if (!parent) {
//             return null;
//         }
//     }
//     return parent;
// }

// function getNode(key: string): { key: string } {
//     if (!nodes[key]) {
//         nodes[key] = new Key(key);
//     }
//     return nodes[key];
// }

// class Key {
//     constructor(readonly key: string) { }
// }