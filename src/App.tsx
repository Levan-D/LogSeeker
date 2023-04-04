/** @format */

import Input from "./components/Input"
import ListDisplay from "./components/ListDisplay"
import BackToTop from "./components/BacktoTop"
import Pagination from "./components/Pagination"
import { useAppDispatch, useAppSelector } from "./app/hooks"

function App() {
  const { searchResults } = useAppSelector(store => store.app)
  return (
    <div>
      <BackToTop />
      <Input />
      {searchResults.length !== 0 && (
        <>
          <ListDisplay />
          <Pagination />
        </>
      )}
    </div>
  )
}

export default App
