import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";
import os from "os";
import path from "path";

// Function to execute Git commands
function runGitCommand(command) {
    try {
        return execSync(command, { encoding: "utf8", stdio: "pipe" }).trim();
    } catch (error) {
        console.error(`Error running command: ${command}\n${error.message}`);
        process.exit(1);
    }
}

// Function to prompt user for input
function askQuestion(query) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(query, (answer) => {
            resolve(answer.trim());
            rl.close();
        });
    });
}

// Main function to automate rebase and amend commit message
async function performRebase() {
    // Ask user for number of commits to rebase
    let inputN = await askQuestion("Enter the number of commits to rebase: ");
    let N = parseInt(inputN, 10);

    if (isNaN(N) || N <= 0) {
        console.error("Invalid input. Please enter a valid number.");
        process.exit(1);
    }

    console.log(`Fetching the last ${N} commits...\n`);

    // Get the last N commits
    const commitList = runGitCommand(`git log --pretty=format:"%h %s" -n ${N}`);
    console.log(commitList);

    // Ask user for the commit hash to modify
    let commitHash = await askQuestion("\nEnter the commit hash to change 'pick' to 'reword': ");

    // Validate commit hash
    if (!commitList.includes(commitHash)) {
        console.error("Invalid commit hash. Please choose from the list above.");
        process.exit(1);
    }

    // Ask for the new commit message
    let newMessage = await askQuestion("Enter the new commit message: ");
    if (!newMessage) {
        console.error("Commit message cannot be empty.");
        process.exit(1);
    }

    console.log(`Starting interactive rebase for the last ${N} commits...\n`);

    try {
        // Create temp file in system temp directory
        const tempDir = os.tmpdir();
        const msgFile = path.join(tempDir, "COMMIT_EDITMSG");
        fs.writeFileSync(msgFile, newMessage);

        // Execute rebase with environment variables
        execSync(
            `GIT_SEQUENCE_EDITOR="sed -i '' 's/^pick ${commitHash}/reword ${commitHash}/'" ` +
            `GIT_EDITOR="cp -f '${msgFile}'" git rebase -i HEAD~${N}`,
            { stdio: "inherit" }
        );

        // Clean up temporary file
        fs.unlinkSync(msgFile);

        console.log("✅ Commit message updated successfully.");
        console.log("✅ Rebase completed successfully.");

        // Ask for confirmation before pushing
        let confirmPush = await askQuestion("Do you want to force push the changes? (yes/no): ");
        if (confirmPush.toLowerCase() === "yes") {
            try {
                runGitCommand("git push --force");
                console.log("✅ Changes pushed successfully.");
            } catch (error) {
                console.error("❌ Push failed. Check your branch and try again.");
                process.exit(1);
            }
        } else {
            console.log("ℹ️ Push skipped. Remember to push manually.");
        }

    } catch (error) {
        console.error("❌ Rebase failed. Resolve conflicts and run: git rebase --continue");
        process.exit(1);
    }
}

// Run the function
performRebase();