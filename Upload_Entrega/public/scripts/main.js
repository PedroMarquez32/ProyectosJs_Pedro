const uploadForm = document.getElementById("uploadForm");
const fileList = document.getElementById("fileList");
const recycleList = document.getElementById("recycleList");
const emptyRecycleBtn = document.getElementById("emptyRecycle");
let spaceChart;

function initChart() {
  const ctx = document.getElementById('spaceChart').getContext('2d');
  spaceChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Espacio en Uploads', 'Espacio en Papelera'],
      datasets: [{
        data: [0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', 
          'rgba(239, 68, 68, 0.8)'   
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Uso de Espacio (MB)',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      cutout: '70%'
    }
  });
}

async function updateSpaceUsage() {
  try {
    const response = await fetch("/uploads/space-usage");
    if (!response.ok) {
      throw new Error('Error al obtener datos de espacio');
    }
    
    const data = await response.json();
    
    // Actualizar datos del gráfico
    spaceChart.data.datasets[0].data = [
      parseFloat(data.uploads.sizeInMB),
      parseFloat(data.recycle.sizeInMB)
    ];
    
    // Actualizar título con el total
    spaceChart.options.plugins.title.text = 
      `Uso de Espacio (Total: ${data.total.sizeInMB} MB)`;
    
    spaceChart.update();
  } catch (error) {
    console.error('Error al actualizar el uso de espacio:', error);
  }
}

async function fetchFiles() {
  const response = await fetch("/uploads");
  if (!response.ok) return;
  
  const files = await response.json();
  fileList.innerHTML = "";
  
  files.forEach(file => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm";
    const size = (file.size / 1024).toFixed(2);
    const date = new Date(file.uploadDate).toLocaleString();
    
    li.innerHTML = `
      <div class="flex-1">
        <div class="font-medium">${file.name}</div>
        <div class="text-sm text-gray-600">
          Tamaño: ${size} KB | Subido: ${date}
        </div>
      </div>
      <button class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 ml-4" 
              data-filename="${file.name}">
        Eliminar
      </button>
    `;
    fileList.appendChild(li);
  });

  
  document.querySelectorAll("#fileList button[data-filename]").forEach(button => {
    button.addEventListener("click", async (e) => {
      const fileName = e.target.dataset.filename;
      await deleteFile(fileName);
      fetchFiles();
      fetchRecycledFiles();
      updateSpaceUsage();
    });
  });
}


async function fetchRecycledFiles() {
  const response = await fetch("/uploads/recycle");
  if (!response.ok) return;
  
  const files = await response.json();
  recycleList.innerHTML = "";
  
  files.forEach(file => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm";
    li.innerHTML = `
      <span class="flex-1 truncate mr-4">${file}</span>
      <div class="flex items-center space-x-2 flex-shrink-0">
        <button 
          class="restore-btn bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm" 
          data-filename="${file}"
        >
          Restaurar
        </button>
        <button 
          class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm" 
          data-filename="${file}"
        >
          Eliminar
        </button>
      </div>
    `;
    recycleList.appendChild(li);
  });

  
  recycleList.querySelectorAll(".restore-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const fileName = e.target.dataset.filename;
      await restoreFile(fileName);
      fetchFiles();
      fetchRecycledFiles();
      updateSpaceUsage();
    });
  });

  
  recycleList.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      if (confirm('¿Estás seguro de que quieres eliminar permanentemente este archivo?')) {
        const fileName = e.target.dataset.filename;
        await deleteFromRecycle(fileName);
        fetchRecycledFiles();
        updateSpaceUsage();
      }
    });
  });
}


async function deleteFile(fileName) {
  const response = await fetch(`/uploads/${fileName}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    console.error(`Error al eliminar: ${fileName}`);
  }
}

async function restoreFile(fileName) {
  const response = await fetch(`/uploads/restore/${fileName}`, {
    method: "POST"
  });
  if (!response.ok) {
    console.error(`Error al restaurar: ${fileName}`);
  }
}

async function emptyRecycleBin() {
  try {
    const response = await fetch("/uploads/empty-recycle", {
      method: "DELETE"
    });
    
    if (!response.ok) {
      throw new Error('Error al vaciar la papelera');
    }
    
    const result = await response.text();
    console.log(result);
    
    
    await fetchRecycledFiles();
    await updateSpaceUsage();
  } catch (error) {
    console.error("Error al vaciar papelera:", error);
    alert("Error al vaciar la papelera");
  }
}


async function deleteFromRecycle(fileName) {
  try {
    console.log('Intentando eliminar:', fileName);
    
    const response = await fetch(`/uploads/recycle/${fileName}`, {
      method: 'DELETE'
    });
    
    console.log('Respuesta del servidor:', {
      status: response.status,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error del servidor: ${errorText}`);
    }
    
    
    await fetchRecycledFiles();
    await updateSpaceUsage();
  } catch (error) {
    console.error('Error completo:', error);
    alert(`Error al eliminar el archivo: ${error.message}`);
  }
}


uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  const response = await fetch("/uploads", {
    method: "POST",
    body: formData
  });
  if (response.ok) {
    uploadForm.reset();
    fetchFiles();
    updateSpaceUsage();
  }
});

emptyRecycleBtn.addEventListener("click", async () => {
  if (confirm('¿Estás seguro de que quieres vaciar la papelera? Esta acción no se puede deshacer.')) {
    await emptyRecycleBin();
    await fetchRecycledFiles();
    await updateSpaceUsage();
  }
});


document.getElementById('emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const emailInput = e.target.elements.email;
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  
  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const response = await fetch('/uploads/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailInput.value })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al suscribirse');
    }

    alert('¡Suscripción exitosa! Revisa tu correo.');
    emailInput.value = '';
  } catch (error) {
    console.error('Error:', error);
    alert('Error al suscribirse: ' + error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});


document.addEventListener("DOMContentLoaded", () => {
  initChart();
  updateSpaceUsage();
  fetchFiles();
  fetchRecycledFiles();
});
