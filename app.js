
const defaultData = {
  "users": [
    {
      "username": "admin",
      "password": "admin123",
      "role": "Administrator"
    },
    {
      "username": "manager",
      "password": "manager123",
      "role": "Team Manager"
    },
    {
      "username": "coach",
      "password": "coach123",
      "role": "Coach"
    },
    {
      "username": "medical",
      "password": "medical123",
      "role": "Medical Staff"
    },
    {
      "username": "athlete",
      "password": "athlete123",
      "role": "Athlete"
    },
    {
      "username": "federation",
      "password": "federation123",
      "role": "Federation"
    }
  ],
  "audit_logs": [],
  "kit_tracking": [
    {
      "player": "John Doe",
      "item": "Jersey",
      "size": "M",
      "status": "Delivered"
    },
    {
      "player": "Alex Smith",
      "item": "Crutches",
      "size": "-",
      "status": "Delivered"
    }
  ],
  "travel_planning": [
    {
      "match": "Championship Qualifier",
      "location": "Warsaw",
      "departure": "2025-07-01",
      "return": "2025-07-03"
    }
  ],
  "training_plans": [
    {
      "week": "Week 1",
      "focus": "Strength & Balance",
      "sessions": "3",
      "notes": "Include crutch mobility drills"
    }
  ],
  "player_progress": [
    {
      "player": "John Doe",
      "metric": "Speed",
      "value": "7.5 km/h"
    },
    {
      "player": "Alex Smith",
      "metric": "Endurance",
      "value": "Moderate"
    }
  ],
  "session_reports": [
    {
      "date": "2025-06-20",
      "coach": "Coach Mike",
      "focus": "Defensive positioning",
      "attendance": "5 players"
    }
  ],
  "injury_records": [
    {
      "player": "Alex Smith",
      "injury": "Shoulder strain",
      "date": "2025-05-15",
      "status": "Recovering"
    }
  ],
  "rehab_logs": [
    {
      "player": "Alex Smith",
      "session": "Physio - Shoulder",
      "date": "2025-06-01",
      "progress": "Good"
    }
  ],
  "medical_reports": [
    {
      "player": "John Doe",
      "report": "Annual check-up",
      "date": "2025-06-10",
      "notes": "Cleared to play"
    }
  ],
  "my_stats": [
    {
      "session": "Training #5",
      "metric": "Speed",
      "value": "7.2 km/h"
    }
  ],
  "session_calendar": [
    {
      "session": "Team Tactics",
      "date": "2025-06-25",
      "time": "17:00"
    }
  ],
  "national_summary": [
    {
      "team": "Poland Amputee",
      "ranking": "Top 5 in Europe"
    }
  ],
  "federation_audit": [
    {
      "action": "Player data updated",
      "by": "admin",
      "date": "2025-06-21"
    }
  ]
};

if (!localStorage.getItem('data')) {
  localStorage.setItem('data', JSON.stringify(defaultData));
}


const defaultData = {
  users: [
    { username: 'admin', password: 'admin123', role: 'Administrator' },
    { username: 'manager', password: 'manager123', role: 'Team Manager' },
    { username: 'coach', password: 'coach123', role: 'Coach' },
    { username: 'medical', password: 'medical123', role: 'Medical Staff' },
    { username: 'athlete', password: 'athlete123', role: 'Athlete' },
    { username: 'federation', password: 'federation123', role: 'Federation' }
  ],
  audit_logs: [],
  kit_tracking: [],
  travel_planning: [],
  training_plans: [],
  player_progress: [],
  session_reports: [],
  injury_records: [],
  rehab_logs: [],
  medical_reports: [],
  my_stats: [],
  session_calendar: [],
  national_summary: [],
  federation_audit: []
};

if (!localStorage.getItem('data')) {
  localStorage.setItem('data', JSON.stringify(defaultData));
}

function getData() { return JSON.parse(localStorage.getItem('data')); }
function setData(data) { localStorage.setItem('data', JSON.stringify(data)); }

function login() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  const data = getData();
  const user = data.users.find(x => x.username === u && x.password === p);
  if (user) {
    data.audit_logs.push({ user: user.username, action: 'Login', time: new Date().toLocaleString() });
    setData(data);
    localStorage.setItem('session', JSON.stringify({ user: user.username, role: user.role }));
    showDashboard(user.role);
  } else {
    document.getElementById('login-error').innerText = 'Invalid credentials';
  }
}

function logout() {
  const session = JSON.parse(localStorage.getItem('session'));
  const data = getData();
  if (session) {
    data.audit_logs.push({ user: session.user, action: 'Logout', time: new Date().toLocaleString() });
    setData(data);
  }
  localStorage.removeItem('session');
  location.reload();
}

function showDashboard(role) {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('role').innerText = role;

  const menu = document.getElementById('menu');
  const content = document.getElementById('content');
  const backup = document.getElementById('backup-restore');
  menu.innerHTML = '';
  content.innerHTML = '';
  backup.innerHTML = '';

  const features = {
    'Administrator': ['User Management', 'Audit Logs', 'Kit Tracking', 'Travel Planning', 'Training Plans', 'Player Progress', 'Session Reports', 'Injury Records', 'Rehab Logs', 'Medical Reports', 'My Stats', 'Session Calendar', 'National Summary', 'Federation Audit'],
    'Team Manager': ['Kit Tracking', 'Travel Planning'],
    'Coach': ['Training Plans', 'Player Progress', 'Session Reports'],
    'Medical Staff': ['Injury Records', 'Rehab Logs', 'Medical Reports'],
    'Athlete': ['My Stats', 'Session Calendar'],
    'Federation': ['National Summary', 'Federation Audit']
  };

  if (role === 'Administrator' || role === 'Federation') {
    const b = document.createElement('button');
    b.innerText = 'Backup Data';
    b.onclick = backupData;
    backup.appendChild(b);

    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = restoreData;
    backup.appendChild(input);
  }

  features[role].forEach(f => {
    const btn = document.createElement('button');
    btn.innerText = f;
    btn.onclick = () => showTable(f);
    menu.appendChild(btn);
  });
}

function labelToKey(label) {
  return label.toLowerCase().replace(/ /g, '_');
}

function showTable(label) {
  const key = labelToKey(label);
  const data = getData();
  let rows = data[key] || [];
  let html = `<h2>${label}</h2><table><thead><tr>`;

  if (rows.length) {
    Object.keys(rows[0]).forEach(k => html += `<th>${k}</th>`);
    html += `<th>Actions</th></tr></thead><tbody>`;
    rows.forEach((row, i) => {
      html += `<tr>`;
      Object.values(row).forEach(v => html += `<td>${v}</td>`);
      html += `<td><button onclick="deleteRow('${label}',${i})">Delete</button></td></tr>`;
    });
  } else {
    html += `<th>No Data</th></tr></thead><tbody>`;
  }

  html += `</tbody></table><button onclick="addRow('${label}')">Add Row</button>`;
  document.getElementById('content').innerHTML = html;
}

function addRow(label) {
  const key = labelToKey(label);
  const data = getData();
  let row = {};
  if (data[key].length) {
    Object.keys(data[key][0]).forEach(k => row[k] = prompt(`Enter ${k}:`, ''));
  } else {
    row = { value: prompt('Enter value:', '') };
  }
  data[key].push(row);
  setData(data);
  showTable(label);
}

function deleteRow(label, i) {
  const key = labelToKey(label);
  const data = getData();
  data[key].splice(i, 1);
  setData(data);
  showTable(label);
}

function backupData() {
  const blob = new Blob([JSON.stringify(getData(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'backup.json';
  a.click();
}

function restoreData(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    setData(JSON.parse(e.target.result));
    alert('Data restored! Reloading...');
    location.reload();
  };
  reader.readAsText(file);
}

window.onload = () => {
  const session = JSON.parse(localStorage.getItem('session'));
  if (session) showDashboard(session.role);
};
  // Use same final app.js logic
