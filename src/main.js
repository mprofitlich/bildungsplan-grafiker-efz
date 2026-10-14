import { mount } from 'svelte';
import '@fontsource-variable/dm-sans';
import App from './App.svelte';
import './app.css';

mount(App, { target: document.getElementById('app') });
