/** @format */

import Input from "./components/Input"
import ListDisplay from "./components/ListDisplay"
import BackToTop from "./components/BacktoTop"
import Pagination from "./components/Pagination"

function App() {
  return (
    <div>
      <BackToTop />
      <Input />
      <ListDisplay />
      <Pagination />
    </div>
  )
}

export default App
