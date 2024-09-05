import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/global'
import { Transactions } from './pages/Transactions'
import { TransactionsProvider } from './contexts/TransactionsContext'
import { CategoriesProvider } from './contexts/CategoriesContext'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <CategoriesProvider>
        <TransactionsProvider>
          <Transactions />
        </TransactionsProvider>
      </CategoriesProvider>
    </ThemeProvider>
  )
}
