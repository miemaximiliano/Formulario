document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('subscription-form');
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const edadInput = document.getElementById('edad');
  const telefonoInput = document.getElementById('telefono');
  const direccionInput = document.getElementById('direccion');
  const ciudadInput = document.getElementById('ciudad');
  const codigoPostalInput = document.getElementById('codigo-postal');
  const dniInput = document.getElementById('dni');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateForm()) {
      const formData = {
        nombre: nombreInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
        edad: edadInput.value,
        telefono: telefonoInput.value,
        direccion: direccionInput.value,
        ciudad: ciudadInput.value,
        codigoPostal: codigoPostalInput.value,
        dni: dniInput.value
      };

      const queryParams = new URLSearchParams(formData).toString();
      const url = 'http://curso-dev-2021.herokuapp.com/newsletter?' + queryParams;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            saveDataToLocalStorage(formData);
            showModal('Suscripción exitosa', JSON.stringify(data));
          } else {
            showModal('Error en la suscripción', data.error);
          }
        })
        .catch(error => {
          showModal('Error en la suscripción', error.message);
        });
    }
  });

  const fields = [
    { input: nombreInput, errorMessage: 'El nombre completo debe tener más de 6 letras y al menos un espacio entre medio.', validation: value => value.trim().length > 6 && value.includes(' ') },
    { input: emailInput, errorMessage: 'Ingrese un email válido.', validation: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
    { input: passwordInput, errorMessage: 'La contraseña debe tener al menos 8 caracteres y contener letras y números.', validation: value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) },
    { input: confirmPasswordInput, errorMessage: 'Las contraseñas no coinciden.', validation: value => value === passwordInput.value },
    { input: edadInput, errorMessage: 'La edad debe ser un número entero mayor o igual a 18.', validation: value => parseInt(value) >= 18 && Number.isInteger(parseFloat(value)) },
    { input: telefonoInput, errorMessage: 'El teléfono debe tener al menos 7 dígitos.', validation: value => /^\d{7,}$/.test(value) },
    { input: direccionInput, errorMessage: 'La dirección debe tener al menos 5 caracteres y contener letras, números y un espacio.', validation: value => /^[A-Za-z0-9\s]{5,}$/.test(value) },
    { input: ciudadInput, errorMessage: 'La ciudad debe tener al menos 3 caracteres.', validation: value => value.trim().length >= 3 },
    { input: codigoPostalInput, errorMessage: 'El código postal debe tener al menos 3 caracteres.', validation: value => value.trim().length >= 3 },
    { input: dniInput, errorMessage: 'El DNI debe tener 7 u 8 dígitos.', validation: value => /^\d{7,8}$/.test(value) }
  ];

  fields.forEach(field => {
    const { input, errorMessage } = field;
    input.addEventListener('blur', function() {
      if (!field.validation(input.value)) {
        showErrorMessage(input, errorMessage);
      }
    });
    
    input.addEventListener('focus', function() {
      hideErrorMessage(input);
    });
  });

  nombreInput.addEventListener('keydown', function() {
    const formTitle = document.getElementById('form-title');
    formTitle.textContent = 'HOLA ' + nombreInput.value;
  });

  function validateForm() {
    let isValid = true;
    fields.forEach(field => {
      const { input, errorMessage } = field;
      if (!field.validation(input.value)) {
        showErrorMessage(input, errorMessage);
        isValid = false;
      }
    });
    return isValid;
  }

  function showErrorMessage(input, message) {
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = message;
  }
  
  function hideErrorMessage(input) {
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = '';
  }

  function saveDataToLocalStorage(formData) {
    localStorage.setItem('formData', JSON.stringify(formData));
  }

  function showModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>${title}</h2>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.getElementsByClassName('close')[0];
    closeButton.addEventListener('click', function() {
      document.body.removeChild(modal);
    });

    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  window.addEventListener('load', function() {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      nombreInput.value = formData.nombre;
      emailInput.value = formData.email;
      passwordInput.value = formData.password;
      confirmPasswordInput.value = formData.confirmPassword;
      edadInput.value = formData.edad;
      telefonoInput.value = formData.telefono;
      direccionInput.value = formData.direccion;
      ciudadInput.value = formData.ciudad;
      codigoPostalInput.value = formData.codigoPostal;
      dniInput.value = formData.dni;
      const formTitle = document.getElementById('form-title');
      formTitle.textContent = 'HOLA ' + formData.nombre;
    }
  });
});