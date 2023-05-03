/** @format */

import Input from "./components/Input";
import ListDisplay from "./components/ListDisplay";
import BackToTop from "./components/BacktoTop";
import Pagination from "./components/Pagination";
import { useAppSelector } from "./app/hooks";

function App() {
  const {
    searchResults,
    logStatus: { loading },
  } = useAppSelector((store) => store.app);
  return (
    <div className="mx-4">
      <BackToTop />
      <Input />
      <ListDisplay />
      {searchResults.length !== 0 && !loading && (
        <>
          <Pagination />
        </>
      )}
    </div>
  );
}

export default App;
