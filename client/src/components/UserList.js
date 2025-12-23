import React from 'react';
import './UserList.css';

function UserList({ users }) {
  return (
    <div className="user-list">
      <h3>Active Users ({users.length})</h3>
      <div className="users">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div
              className="user-color"
              style={{ backgroundColor: user.color }}
            />
            <span className="user-name">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
