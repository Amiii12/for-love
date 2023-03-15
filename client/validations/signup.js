import { isEmpty } from './../utils/utils.js'

const dom = document

// Form
const signupForm = dom.querySelector('#signup_form')

// Fields
let email = dom.querySelector('#email')
let password = dom.querySelector('#password')
let firstname = dom.querySelector('#firstname')
let lastname = dom.querySelector('#lastname')

/**
 * Show the custom modal | Swal
 * @param {{ icon: string, title: string, text: string, timer: number }} 
 * @return {void}
 */
const showCustomModal = ({ icon, title, text, timer = 5000 }) => {
  Swal.fire({
    position: 'center',
    icon: icon ?? 'warning',
    title,
    text,
    showConfirmButton: false,
    timer
  })
}

signupForm.addEventListener('submit', async e => {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)

  formData.set('email', email.value.trim().toLowerCase())
  formData.set('password', password.value.trim())
  formData.set('firstname', firstname.value.trim())
  formData.set('lastname', lastname.value.trim())

  const isEmptyFields = [
    isEmpty(email.value),
    isEmpty(password.value),
    isEmpty(firstname.value),
    isEmpty(lastname.value)
  ]
  
  const isEmptySomeField = isEmptyFields.some(value => value)

  const isValidEmail = value => {

    if (value.length < 13)
      return false

    if (value.length > 40)
      return false

    if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value))
      return false
      
      return true
  }

  const isValidPassword = value => {

    if (value.length < 7)
      return false

    if (value.length > 15)
      return false

    return true
  }

  const isValidFirstname = value => {

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{3,25}$/.test(value))
      return false

    return true
  }

  const isValidLastname = value => {

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{3,30}$/.test(value))
      return false

    return true
  }
 
  if (!isEmptySomeField) {

    if (isValidEmail(formData.get('email'))) {
    
      if (isValidPassword(formData.get('password'))) {

        if (isValidFirstname(formData.get('firstname'))) {

          if (isValidLastname(formData.get('lastname'))) {

            // Enviando la petición al servidor 
            await fetch('./signUp.php', {
              method: 'POST',
              body: formData
            })
              .then(res => res.json())
              .then(({ data }) => {
                const { statusCode } = data.headers
                
                if (statusCode === 201) {
                  const { firstname } = data.body
      
                  showCustomModal({
                    icon: 'success',
                    title: '¡Muy bien!',
                    text: `¡${firstname} te has registrado correctamente!`,
                    timer: 1500
                  })
        
                  // Limpiando el formulario
                  signupForm.reset()

                } else {
                  // Email ya existente en la BD
                  showCustomModal({
                    title: 'Oops! Email no válido',
                    text: 'Ya existe una cuenta con ese email',
                  })
                }
              })

            } else {
              // Apellido(s)
              showCustomModal({
                title: 'Oops! Sus apellidos no son válidos',
                text: '- Verifique que esté bien escrito\n' +
                '- Caracteres permitidos: (min 3) - ' +
                '(max 30)'
              })
            }

          } else {
            // Nombre
            showCustomModal({
              title: 'Oops! El primer nombre no es válido',
              text: '- Verifique que esté bien escrito\n' +
              '- Caracteres permitidos: (min 3) - ' +
              '(max 25)'
            })
          }

      } else {
        // Contraseña
        showCustomModal({
          title: 'Oops! La contraseña no es válida',
          text: 'Verifique que este cumpla la cantidad de caracteres\n' +
          '- Caracteres permitidos: (min 7) - ' +
          '(max 15)'
        })
      }

    } else {
      // Email
      showCustomModal({
        title: 'Oops! Email no válido',
        text: '- Verifique que esté bien escrito\n' +
        '- Caracteres permitidos: (min 13) - ' +
        '(max 40)'
      })
    }
  } else {
    // Algún campo vacío
    showCustomModal({
      title: 'Oops!',
      text: 'Verifique que los campos no estén vacíos'
    })
  }
})

