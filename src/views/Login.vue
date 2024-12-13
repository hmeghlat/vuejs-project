
<template>
    <div class="container" id="container">
        <div class="form-container sign-up-container">
            <form action="#">
                <h1>Create Account</h1>
                <div class="social-container">
                    <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                    <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <span>or use your email for registration</span>
                <input type="text" placeholder="Username" v-model="username" :class="{'error': errors.username}" />
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
                <input type="email" placeholder="Email" v-model="email" :class="{'error': errors.email}" />
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                <input type="password" placeholder="Password" v-model="password" :class="{'error': errors.password}" />
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

                <!-- Rôle -->
                <select v-model="role" :class="{'error': errors.role}">
                    <option disabled value="">Select Role</option>
                    <option value="administrateur">administrateur</option>
                    <option value="chef d'équipe">chef d'équipe</option>
                    <option value="utilisateur">utilisateur</option>
                </select>
                <span v-if="errors.role" class="error-message">{{ errors.role }}</span>
                <button  id="signUpButton" @click.prevent="handleSignUp">Sign Up</button>
            </form>
        </div>
        <div class="form-container sign-in-container">
            <form action="#">
                <h1>Sign in</h1>
                <div class="social-container">
                    <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
                    <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <span>or use your account</span>
                <input type="text" placeholder="Username" v-model="username" :class="{'error': errors.username}" />
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
                <input type="password" placeholder="Password" v-model="password" :class="{'error': errors.password}" />
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

                <a href="#">Forgot your password?</a>

                <!-- Rôle -->
                <select v-model="role" :class="{'error': errors.role}">
                    <option disabled value="">Select Role</option>
                    <option value="administrateur">administrateur</option>
                    <option value="chef d'équipe">chef d'équipe</option>
                    <option value="utilisateur">utilisateur</option>
                </select>
                <span v-if="errors.role" class="error-message">{{ errors.role }}</span>
                <button  id="signInButton" @click.prevent="handleLogin">Sign In</button>
            </form>
        </div>
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>To keep connected with us please login with your personal info</p>
                    <button class="ghost" id="signInButtonOverlay" @click="togglePanel">Sign In</button>
                </div>
                <div class="overlay-panel overlay-right">
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details and start journey with us</p>
                    <button class="ghost" id="signUpButtonOverlay" @click="togglePanel">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
</template>

  
  <script>
  import axios from 'axios';
  export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      username: "",
      role: "",
      errors: {},
    };
  },
  methods: {
    validateFields() {
            this.errors = {}; // Reset errors
            let isValid = true;

            if (!this.username) {
                this.errors.username = "Username is required.";
                isValid = false;
            }
           
            if (!this.password) {
                this.errors.password = "Password is required.";
                isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(this.password)) {
                this.errors.password = "Password must be at least 8 characters, contain a capital letter, a lowercase letter, and a number.";
                isValid = false;
            }
            if (!this.role) {
                this.errors.role = "Role selection is required.";
                isValid = false;
            }

            return isValid;
        },


    validationEmail(){
        this.errors = {}; // Reset errors
        let isValid = true;

        if (!this.email) {
                this.errors.email = "Email is required.";
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(this.email)) {
                this.errors.email = "Email is invalid.";
                isValid = false;
            }
            return isValid;
    },

    handleLogin(event) {
      if (this.validateFields()) {
      // Code pour gérer la connexion
      //event.preventDefault();
      //console.log({
      //username: this.username,
      //password: this.password,
      //role: this.role,
   // });
    event.preventDefault();
    axios.post('http://127.0.0.1:5000/auth/login', {
      username: this.username,
      password: this.password
    })
    .then(response => {
      console.log('Connexion réussie:', response.data);
      
       // Stockez les données de l'utilisateur dans le localStorage
       localStorage.setItem('user', JSON.stringify({
        username: this.username,
        role: this.role // Vous pouvez ajouter d'autres informations ici
      }));

      this.$router.push('/dashboard'); // Redirection après connexion réussie
    })
    .catch(error => {
      console.error('Erreur lors de la connexion:', error);
      alert(error.response.data.message);
    });
    }
    },
    handleSignUp(event) {
      if (this.validateFields()&& this.validationEmail()) {
      // Code pour gérer l'inscription
      //event.preventDefault();
      //console.log({
      //username: this.username,
      //password: this.password,
      //email: this.email,
      //role: this.role,

    event.preventDefault();
    axios.post('http://127.0.0.1:5000/auth/register', {
      username: this.username,
      password: this.password,
      email: this.email,
      role: this.role
    })
    .then(response => {
      console.log('Inscription réussie:', response.data);

       // Stockez les données de l'utilisateur dans le localStorage
       localStorage.setItem('user', JSON.stringify({
        username: this.username,
        role: this.role // Vous pouvez ajouter d'autres informations ici
      }));

      this.$router.push('/dashboard'); // Redirection après inscription réussie
    })
    .catch(error => {
      console.error('Erreur lors de l\'inscription:', error);
      alert(error.response.data.message);
    });
    }
    },
    togglePanel() {
      const container = document.getElementById("container");
      container.classList.toggle("right-panel-active");
    },
  },
};
  
  </script>
  
  <style scoped>
    @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');
  * {
	box-sizing: border-box;
}

body {
	background: #f6f5f7;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-family: 'Montserrat', sans-serif;
	height: 100vh;
	margin: -20px 0 50px;
}

h1 {
	font-weight: bold;
	margin: 0;
}

h2 {
	text-align: center;
}

p {
	font-size: 14px;
	font-weight: 100;
	line-height: 20px;
	letter-spacing: 0.5px;
	margin: 20px 0 30px;
}

span {
	font-size: 12px;
}

a {
	color: #333;
	font-size: 14px;
	text-decoration: none;
	margin: 15px 0;
}

button {
	border-radius: 20px;
	border: 1px solid #FF4B2B;
	background-color: #FF4B2B;
	color: #FFFFFF;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 45px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 80ms ease-in;
}

button:active {
	transform: scale(0.95);
}

button:focus {
	outline: none;
}

button.ghost {
	background-color: transparent;
	border-color: #FFFFFF;
}

form {
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: 100%;
	text-align: center;
}

input {
	background-color: #eee;
	border: none;
	padding: 12px 15px;
	margin: 8px 0;
	width: 100%;
}

.container {
	background-color: #fff;
	border-radius: 10px;
  	box-shadow: 0 14px 28px rgba(0,0,0,0.25), 
			0 10px 10px rgba(0,0,0,0.22);
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in-container {
	left: 0;
	width: 50%;
	z-index: 2;
}

.container.right-panel-active .sign-in-container {
	transform: translateX(100%);
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.right-panel-active .sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

@keyframes show {
	0%, 49.99% {
		opacity: 0;
		z-index: 1;
	}
	
	50%, 100% {
		opacity: 1;
		z-index: 5;
	}
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.container.right-panel-active .overlay-container{
	transform: translateX(-100%);
}

.overlay {
	background: #FF416C;
	background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
	background: linear-gradient(to right, #FF4B2B, #FF416C);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #FFFFFF;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
  	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  	transform: translateX(50%);
}

.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.container.right-panel-active .overlay-right {
	transform: translateX(20%);
}

.social-container {
	margin: 20px 0;
}

.social-container a {
	border: 1px solid #DDDDDD;
	border-radius: 50%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	margin: 0 5px;
	height: 40px;
	width: 40px;
}

footer {
    background-color: #222;
    color: #fff;
    font-size: 14px;
    bottom: 0;
    position: fixed;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 999;
}

footer p {
    margin: 10px 0;
}

footer i {
    color: red;
}

footer a {
    color: #3c97bf;
    text-decoration: none;
}

select {
    width: 100%;
    padding: 12px 15px;
    margin: 8px 0;
    background-color: #eee;
    border: none;
    border-radius: 20px;
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
    transition: background-color 0.3s ease-in-out;
    appearance: none; /* Supprime le style par défaut du navigateur */
}

select:focus {
    outline: none;
    background-color: #ddd;
}

select option {
    font-weight: normal;
    text-transform: none;
}

select:hover {
    background-color: #ddd;
    cursor: pointer;
}

.error {
    border-color: red;
}
.error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}

  </style>
  