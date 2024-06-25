// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as sqlite3 from 'sqlite3';
import path from 'path';
import { SearchHistoryProvider } from './searchHistoryView';
import { getSearchHistory } from './getSearchHistory';

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

	const searchHistoryProvider = new SearchHistoryProvider(context);
	vscode.window.registerTreeDataProvider('searchLog', searchHistoryProvider);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('helloWorld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from NEWBOX!');
		vscode.window.showWarningMessage('Hello World from NEWBOX!');
	});

	vscode.commands.registerCommand('nb.search.refreshSearchHistory', () => searchHistoryProvider.refresh());

	context.subscriptions.push(disposable);

	const disposable2 = vscode.commands.registerCommand('nb.search.showHistory', async () => {
		let searchHistory = context.globalState.get('searchHistory', []);
		let workspaceStorage = context.storageUri?.fsPath;
		if (workspaceStorage) {
			const workspaceStoragePath = path.parse(workspaceStorage).dir;
			const dbPath = path.join(workspaceStoragePath, 'state.vscdb');
			const historyValue = await getSearchHistory(dbPath);

			// save to global state
			context.globalState.update('searchHistory', historyValue);
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
