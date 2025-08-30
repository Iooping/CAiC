// Function to handle tab navigation
function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active-section');
    });

    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(sectionId).classList.add('active-section');

    // Activate the corresponding nav item
    document.querySelector(`.nav-item[href="#${sectionId}"]`).classList.add('active');
}

// Event listeners for sidebar navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('href').substring(1);
        navigateToSection(sectionId);
    });
});

// Mock Data for demonstration
const mockAgents = [
    { id: 'agent-1', name: 'Brand AI', status: 'active', client: 'client-a' },
    { id: 'agent-2', name: 'Support Bot', status: 'inactive', client: 'client-a' },
    { id: 'agent-3', name: 'Marketing AI', status: 'active', client: 'client-b' }
];

const mockLogs = [
    { id: 'log-1', client: 'client-a', text: 'Client A: User asked about pricing.', timestamp: '2025-08-30 10:00 AM' },
    { id: 'log-2', client: 'client-b', text: 'Client B: AI helped with a design prompt.', timestamp: '2025-08-30 10:05 AM' },
    { id: 'log-3', client: 'client-a', text: 'Client A: AI deployed a new campaign asset.', timestamp: '2025-08-30 10:15 AM' }
];

// Function to render agents for the selected client
function renderAgents(clientId) {
    const agentList = document.getElementById('agent-list');
    agentList.innerHTML = ''; // Clear previous list

    const agents = mockAgents.filter(agent => agent.client === clientId);

    if (agents.length === 0) {
        agentList.innerHTML = '<p style="text-align:center;">No agents found for this client.</p>';
        return;
    }

    agents.forEach(agent => {
        const li = document.createElement('li');
        li.className = 'agent-item';
        li.innerHTML = `
            <div>
                <span class="agent-status-dot status-${agent.status}"></span>
                <span>${agent.name}</span>
            </div>
            <div class="agent-controls">
                <button class="toggle-status-btn" data-agent-id="${agent.id}" data-status="${agent.status}">
                    ${agent.status === 'active' ? '⏸️' : '▶️'}
                </button>
                <button class="edit-agent-btn" data-agent-id="${agent.id}">✏️</button>
                <button class="delete-agent-btn" data-agent-id="${agent.id}">🗑️</button>
            </div>
        `;
        agentList.appendChild(li);
    });

    // Add event listeners for the new buttons
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
        btn.addEventListener('click', handleToggleStatus);
    });
}

// Function to render conversation logs for the selected client
function renderLogs(clientId) {
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';

    const logs = mockLogs.filter(log => log.client === clientId);

    if (logs.length === 0) {
        logList.innerHTML = '<p>No conversation logs for this client.</p>';
        return;
    }

    logs.forEach(log => {
        const div = document.createElement('div');
        div.className = 'log-item';
        div.innerHTML = `
            <p>${log.text}</p>
            <small>${log.timestamp}</small>
        `;
        logList.appendChild(div);
    });
}

// Function to handle client switching
function handleClientSwitch() {
    const selectedClientId = document.getElementById('client-select').value;
    console.log(`Switched to client: ${selectedClientId}`);
    // This is where we would fetch and display real data from Firestore
    // For now, we'll use our mock data
    renderAgents(selectedClientId);
    renderLogs(selectedClientId);
}

// Event listeners for dashboard controls
document.getElementById('client-select').addEventListener('change', handleClientSwitch);

document.getElementById('add-agent-btn').addEventListener('click', () => {
    console.log('Add Agent button clicked! - This would open a modal for creating a new agent.');
    // Logic for a modal form to create a new agent
});

function handleToggleStatus(e) {
    const agentId = e.target.dataset.agentId;
    const currentStatus = e.target.dataset.status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log(`Toggling status for Agent ${agentId} to ${newStatus}`);
    // In a real application, this would trigger a Firebase Function to update the agent status in Firestore
    // For this demo, we'll just update the mock data and re-render
    const agentToUpdate = mockAgents.find(agent => agent.id === agentId);
    if (agentToUpdate) {
        agentToUpdate.status = newStatus;
        renderAgents(document.getElementById('client-select').value);
    }
}

// Initial render on page load
handleClientSwitch();
