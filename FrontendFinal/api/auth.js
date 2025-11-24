// app/api/auth.js
import api from './axios';


export async function registrarUsuario(data) {
  try {
    const response = await api.post('/autenticacion/registro', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function iniciarSesion(data) {
  try {
    const response = await api.post('/autenticacion/iniciar-sesion', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
