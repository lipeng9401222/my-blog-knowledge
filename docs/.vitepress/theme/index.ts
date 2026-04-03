import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import NavLinks from './NavLinks.vue'
import './style.css'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('NavLinks', NavLinks)
    }
}
