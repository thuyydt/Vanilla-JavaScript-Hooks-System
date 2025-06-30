<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla JS Hooks System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        button {
            background: #007acc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #005999;
        }
        .output {
            background: #f8f8f8;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
            font-family: monospace;
            min-height: 100px;
            white-space: pre-wrap;
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #007acc;
            padding-bottom: 10px;
        }
        h2 {
            color: #555;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Vanilla JavaScript Hooks System</h1>
        
        <h2>Hook System Demo</h2>
        <p>This demonstrates how vanilla JavaScript can create hooks that run functions from other files.</p>
        
        <button onclick="triggerUserActions()">Trigger User Actions Hook</button>
        <button onclick="triggerDataProcessing()">Trigger Data Processing Hook</button>
        <button onclick="triggerUIUpdates()">Trigger UI Updates Hook</button>
        <button onclick="clearOutput()">Clear Output</button>
        
        <div class="output" id="output">Output will appear here...</div>
        
        <h2>How it works:</h2>
        <ul>
            <li><strong>Hook System:</strong> Central system that manages and executes hooks</li>
            <li><strong>Function Registration:</strong> Functions from different files can register to hooks</li>
            <li><strong>Hook Execution:</strong> When a hook is triggered, all registered functions run</li>
            <li><strong>Module System:</strong> Uses ES6 modules to import functions from other files</li>
        </ul>
    </div>

    <script type="module" src="js/main.js"></script>
</body>
</html>
