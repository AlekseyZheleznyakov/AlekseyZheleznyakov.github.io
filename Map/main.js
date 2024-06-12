import React from 'react';
import { createRoot } from 'react-dom/client';
import Map from './node_modules/react-map-gl/dist/es5/exports-maplibre';
const App = () => {
    return (React.createElement(Map, { initialViewState: {
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14
        }, style: { width: 600, height: 400 }, mapStyle: "https://demotiles.maplibre.org/style.json" }));
};
async function onLoad() {
    const rootElement = document.getElementById('root');
    if (!rootElement)
        return;
    const root = createRoot(rootElement);
    root.render(React.createElement("div", null,
        React.createElement(App, null)));
}
export default App;
window.onload = onLoad;
//# sourceMappingURL=Main.js.map