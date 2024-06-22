// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as sqlite3 from 'sqlite3';
import path from 'path';

// C:\Users\15544\workspace\vscode\src\vs\workbench\contrib\search\common\searchHistoryService.ts
// ========================================================================================================
interface ISearchHistoryValues {
	search?: string[];
	replace?: string[];
	include?: string[];
	exclude?: string[];
}
// ========================================================================================================

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloWorld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('helloWorld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from NEWBOX!');
		vscode.window.showWarningMessage('Hello World from NEWBOX!');
	});

	context.subscriptions.push(disposable);

	const disposable2 = vscode.commands.registerCommand('nb.search.showHistory', () => {
		let searchHistory = context.globalState.get('searchHistory', []);
		let workspaceStorage = context.storageUri?.fsPath;
		let historyValue: ISearchHistoryValues | undefined;
		if (workspaceStorage) {
			const workspaceStoragePath = path.parse(workspaceStorage).dir;
			const dbPath = path.join(workspaceStoragePath, 'state.vscdb');
			const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err: any) => {
				if (err) {
					console.error(err.message);
				}
				console.log('Connected to the vsc database.');
			});

			const SEARCH_HISTORY_KEY = 'workbench.search.history';
			const TABLE_NAME = 'ItemTable';
			const query = `SELECT value FROM ${TABLE_NAME} WHERE key = ?`;

			db.get(query, [SEARCH_HISTORY_KEY], (err: any, raw: any) => {
				if (err) {
					throw err;
				}
				if (raw) {
					try {
						historyValue = JSON.parse(raw.value);
					} catch (e) {
						// Invalid data
					}
					console.log(`Value for '${SEARCH_HISTORY_KEY}':`, historyValue);
					vscode.window.showInformationMessage(`Value for '${SEARCH_HISTORY_KEY}': ${historyValue}`);
				} else {
					console.log(`Key '${SEARCH_HISTORY_KEY}' not found.`);
					vscode.window.showInformationMessage(`Key '${SEARCH_HISTORY_KEY}' not found.`);
				}

				// close the database connection in callback
				db.close((err: any) => {
					if (err) {
						console.error(err.message);
					}
					console.log('Closed the database connection.');
				});
			});

			// save to global state
			context.globalState.update('searchHistory', historyValue);
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
