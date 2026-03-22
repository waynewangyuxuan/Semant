import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { DocsLayout } from "./components/docs/DocsLayout";
import { DocsHome } from "./pages/docs/DocsHome";
import { Why } from "./pages/docs/Why";
import { QuickStart } from "./pages/docs/QuickStart";
import { WrapComponent } from "./pages/docs/WrapComponent";
import { ApiReference } from "./pages/docs/ApiReference";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsHome />} />
          <Route path="why" element={<Why />} />
          <Route path="quickstart" element={<QuickStart />} />
          <Route path="guides/wrap-component" element={<WrapComponent />} />
          <Route path="reference/api" element={<ApiReference />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
