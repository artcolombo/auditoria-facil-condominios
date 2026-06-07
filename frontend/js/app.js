/**
 * Main Application Logic for Auditoria Fácil Condomínios
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check API health
    checkAPIHealth().then(isHealthy => {
        const statusEl = document.getElementById('apiStatus');
        if (isHealthy) {
            statusEl.innerHTML = '<span class="badge bg-success">API Conectada</span>';
        } else {
            statusEl.innerHTML = '<span class="badge bg-danger">API Desconectada</span>';
        }
    });

    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Form submission
    document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);

    // Clear button
    document.getElementById('clearBtn').addEventListener('click', handleClear);

    // File input change
    document.getElementById('pdfFile').addEventListener('change', handleFileChange);

    // Export button
    document.getElementById('exportBtn').addEventListener('click', handleExport);
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    hideError();

    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
        showError(validation.errors.join('<br>'));
        return;
    }

    // Process file
    await processFile(file);
}

/**
 * Process the uploaded file
 */
async function processFile(file) {
    const processBtn = document.getElementById('processBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    try {
        // Show progress
        showElement(progressContainer);
        setButtonLoading(processBtn, 'Processando...');
        progressBar.style.width = '50%';

        // Upload and process
        const response = await uploadFile(file, '/statements/upload');
        progressBar.style.width = '100%';

        // Store response for export
        window.lastProcessedData = response;

        // Display results
        displayResults(response);

        // Reset form
        setTimeout(() => {
            resetButton(processBtn);
            hideElement(progressContainer);
            progressBar.style.width = '0%';
        }, 500);
    } catch (error) {
        resetButton(processBtn);
        hideElement(progressContainer);
        progressBar.style.width = '0%';
        showError(`Erro ao processar arquivo: ${error.message}`);
    }
}

/**
 * Display results on page
 */
function displayResults(response) {
    const resultsContainer = document.getElementById('resultsContainer');
    const tableBody = document.getElementById('tableBody');

    // Update summary
    document.getElementById('fileName').textContent = response.file_name;
    document.getElementById('uploadTime').textContent = formatTimestamp();
    document.getElementById('totalEntries').textContent = response.total_entries;

    // Clear table
    tableBody.innerHTML = '';

    // Add table rows
    response.entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        const movementBadgeClass = entry.movement_type === 'credit' ? 'badge-credit' : 'badge-debit';
        const movementText = entry.movement_type === 'credit' ? 'Crédito' : 'Débito';

        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.description}</td>
            <td class="text-end">${formatCurrency(entry.value)}</td>
            <td>
                <span class="badge ${movementBadgeClass}">${movementText}</span>
            </td>
            <td class="text-end">${entry.balance ? formatCurrency(entry.balance) : '-'}</td>
        `;

        tableBody.appendChild(row);
    });

    // Calculate and display totals
    const totals = calculateTotals(response.entries);
    document.getElementById('totalCredits').textContent = formatCurrency(totals.credits);
    document.getElementById('totalDebits').textContent = formatCurrency(totals.debits);
    document.getElementById('netBalance').textContent = formatCurrency(totals.net);

    // Show results
    showElement(resultsContainer);
    document.getElementById('exportBtn').disabled = false;

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Handle clear button click
 */
function handleClear() {
    clearForm('uploadForm');
    hideElement('resultsContainer');
    hideError();
    document.getElementById('exportBtn').disabled = true;
    window.lastProcessedData = null;
}

/**
 * Handle file input change
 */
function handleFileChange(e) {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
        const validation = validateFile(file);
        if (!validation.valid) {
            showError(validation.errors.join('<br>'));
            fileInput.value = '';
        }
    }
}

/**
 * Handle export to Excel
 */
async function handleExport() {
    const exportBtn = document.getElementById('exportBtn');
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (!file) {
        showError('Nenhum arquivo disponível para exportar');
        return;
    }

    try {
        setButtonLoading(exportBtn, 'Gerando Excel...');

        // Use fetch to get the generated Excel as a blob
        const formData = new FormData();
        formData.append('file', file);

        const resp = await fetch(`${API_BASE_URL}/statements/export-excel`, {
            method: 'POST',
            body: formData
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.detail || `HTTP ${resp.status}`);
        }

        const blob = await resp.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name.replace('.pdf', '.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        showError(`Erro ao gerar Excel: ${error.message}`);
    } finally {
        resetButton(exportBtn);
    }
}
