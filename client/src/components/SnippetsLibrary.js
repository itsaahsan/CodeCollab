import React, { useState } from 'react';
import './SnippetsLibrary.css';

const DEFAULT_SNIPPETS = {
  javascript: [
    { id: 1, name: 'Async Function', code: 'async function fetchData() {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(error);\n  }\n}' },
    { id: 2, name: 'Array Methods', code: 'const arr = [1, 2, 3, 4, 5];\n\n// Map\nconst doubled = arr.map(x => x * 2);\n\n// Filter\nconst evens = arr.filter(x => x % 2 === 0);\n\n// Reduce\nconst sum = arr.reduce((acc, x) => acc + x, 0);' },
    { id: 3, name: 'Class Example', code: 'class Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  greet() {\n    console.log(`Hello, I\'m ${this.name}`);\n  }\n}' },
    { id: 4, name: 'Promise Chain', code: 'fetchUser(userId)\n  .then(user => fetchPosts(user.id))\n  .then(posts => displayPosts(posts))\n  .catch(error => handleError(error))\n  .finally(() => hideLoader());' }
  ],
  python: [
    { id: 5, name: 'List Comprehension', code: '# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# Filter with condition\nevens = [x for x in range(20) if x % 2 == 0]' },
    { id: 6, name: 'Class Example', code: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def greet(self):\n        print(f"Hello, I\'m {self.name}")' },
    { id: 7, name: 'File Operations', code: '# Read file\nwith open(\'file.txt\', \'r\') as f:\n    content = f.read()\n\n# Write file\nwith open(\'output.txt\', \'w\') as f:\n    f.write(\'Hello World\')' }
  ],
  typescript: [
    { id: 8, name: 'Interface', code: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive?: boolean;\n}\n\nconst user: User = {\n  id: 1,\n  name: "John",\n  email: "john@example.com"\n};' },
    { id: 9, name: 'Generic Function', code: 'function identity<T>(arg: T): T {\n  return arg;\n}\n\nconst result = identity<string>("Hello");\nconst num = identity<number>(42);' }
  ],
  react: [
    { id: 10, name: 'useState Hook', code: 'import React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}' },
    { id: 11, name: 'useEffect Hook', code: 'import React, { useState, useEffect } from \'react\';\n\nfunction DataFetcher() {\n  const [data, setData] = useState(null);\n  \n  useEffect(() => {\n    fetch(\'/api/data\')\n      .then(res => res.json())\n      .then(data => setData(data));\n  }, []);\n  \n  return <div>{JSON.stringify(data)}</div>;\n}' }
  ]
};

function SnippetsLibrary({ isOpen, onClose, onInsert, language }) {
  const [selectedCategory, setSelectedCategory] = useState('javascript');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = Object.keys(DEFAULT_SNIPPETS);
  const snippets = DEFAULT_SNIPPETS[selectedCategory] || [];
  const filteredSnippets = snippets.filter(snippet =>
    snippet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="snippets-overlay" onClick={onClose}>
      <div className="snippets-library" onClick={(e) => e.stopPropagation()}>
        <div className="snippets-header">
          <h3>📚 Code Snippets</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="snippets-search">
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="snippets-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="snippets-list">
          {filteredSnippets.length === 0 ? (
            <div className="snippets-empty">
              <p>No snippets found</p>
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <div key={snippet.id} className="snippet-item">
                <div className="snippet-header">
                  <h4>{snippet.name}</h4>
                  <button
                    className="btn-insert"
                    onClick={() => {
                      onInsert(snippet.code);
                      onClose();
                    }}
                  >
                    Insert
                  </button>
                </div>
                <pre className="snippet-preview">{snippet.code}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SnippetsLibrary;
