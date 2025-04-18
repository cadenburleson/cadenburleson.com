import './style.css'
import { createClient } from '@supabase/supabase-js'
import { renderNavigation } from './components/Navigation.js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
export const supabase = createClient(supabaseUrl, supabaseKey)

// Simple starter app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app')
  app.innerHTML = ''

  // Add navigation
  const nav = renderNavigation('/')
  app.appendChild(nav)

  // Add main content
  const main = document.createElement('main')
  main.innerHTML = `
    <div class="hero">
      <h1>Caden Burleson</h1>
      <p>Web Developer & Creator</p>
      <button id="cta-button">See My Work</button>
    </div>
  `
  app.appendChild(main)

  // Add simple interactivity
  const ctaButton = document.getElementById('cta-button')
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      alert('Button clicked! Navigation will be implemented soon.')
    })
  }

  console.log('App initialized with simplified code.')
})
