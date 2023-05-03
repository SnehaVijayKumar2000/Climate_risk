import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css'
import L from "leaflet"
import riskData from './data/data.json';
import { useState } from "react";
import DataTable from 'react-data-table-component';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({decade}:{decade:string}) => { 
  const decades = [...new Set(riskData.map(risk => risk.Year).sort())]

  const center = [52.22977, 21.01178];
  const columns = [
    {
        name: 'Asset Name',
        selector: row => row['Asset Name'],
        sortable: true,
    },
    {
        name: 'Lat',
        selector: row => row.Lat,
        sortable: true,
    },
    {
      name: 'Long',
      selector: row => row.Long,
      sortable: true,
  },
  {
    name: 'Business Category',
    selector: row => row["Business Category"],
    sortable: true,
},
{
  name: 'Risk Rating',
  selector: row => row["Risk Rating"],
  sortable: true,
},
{
  name: 'Risk Factors',
  selector: row => Object.keys(row["Risk Factors"]).join(","),
  sortable: true,
  wrap: true
},{
  name: 'Year',
  selector: row => row.Year,
  sortable: true,
},
];
const [filterText, setFilterText] = useState('');
const [location, setLocation] = useState('');
const [asset, setAsset] = useState('');
const [bc, setBc] = useState('');
const labels = decades
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Risk Rating Chart',
    },
  },
};
const icon0 = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const icon1 = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const icon2 = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const icon3 = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}); 
  const toBeMarked = riskData.filter(risk => risk.Year === Number(decade))
  Array.isArray(document.getElementsByClassName("existingMarkers")) ? Array.from(document.getElementsByClassName("existingMarkers")).forEach(marker => marker.remove()) : []
  return (
    <main>
    <MapContainer center={[toBeMarked[0].Lat, toBeMarked[0].Long]} zoom={13} scrollWheelZoom={false} style={{height: 400, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {toBeMarked.map((marker,id)=> 
            <Marker  eventHandlers={{
              click: (e) => {
                const riskObject = riskData.filter(risk => risk.Year === Number(decade) && risk.Lat === e.target._preSpiderfyLatlng.lat && risk.Long === e.target._preSpiderfyLatlng.lng && risk["Asset Name"] === e.target.options.title.split(" -- ")[0].trim() && risk["Business Category"] === e.target.options.title.split(" -- ")[1].trim())[0]
                if(riskObject){
                  setFilterText(Object.keys(riskObject["Risk Factors"]).join(","))
                  setLocation(`${riskObject.Lat},${riskObject.Long}`)
                  setAsset(`${riskObject["Asset Name"]}`)
                  setBc(`${riskObject["Business Category"]}`)
                }
              },
            }} className="existingMarkers" key={id} position={[marker.Lat, marker.Long]} icon={marker["Risk Rating"] <= 0.25 ? icon0 : (marker["Risk Rating"] <= 0.5 ? icon1 : (marker["Risk Rating"] <= 0.75 ? icon2 : (marker["Risk Rating"] <= 1 ? icon3 : icon3)))} title={marker['Asset Name'] + " -- " + marker['Business Category']}>
            </Marker>
          )}
       </MarkerClusterGroup>
    </MapContainer>
    <input type="search" value={filterText} onChange={(e) => {setFilterText(e.target.value);}} placeholder="Search Risk Factors"/>
        <DataTable 
            columns={columns}
            data={riskData.filter(risk => risk.Year === Number(decade)).filter(
              item => filterText ? Object.keys(item["Risk Factors"]).join(",").toLowerCase().includes(filterText.toLowerCase()) :  true,
            )}
            persistTableHead
            pagination
        />
        <input type="search" value={location} onChange={(e) => {setLocation(e.target.value);}} placeholder="Lat,Long"/>
        <input type="search" value={asset} onChange={(e) => {setAsset(e.target.value);}} placeholder="Asset"/>
        <input type="search" value={bc} onChange={(e) => {setBc(e.target.value);}} placeholder="Business Category"/>
        <Line
          options={options}
          data={{labels,datasets:[{label: 'Location',data:riskData.filter(risk=>risk.Lat === Number(location.split(",")[0]) && risk.Long === Number(location.split(",")[1])).map(risk => risk["Risk Rating"]),borderColor: 'rgb(255, 99, 132)',backgroundColor: 'rgba(255, 99, 132, 0.5)',},{label: 'Asset',data:riskData.filter(risk=>risk["Asset Name"] === asset).map(risk => risk["Risk Rating"]), borderColor: 'rgb(53, 162, 235)',backgroundColor: 'rgba(53, 162, 235, 0.5)'},{label: 'Business Category',data:riskData.filter(risk=>risk["Business Category"] === bc).map(risk => risk["Risk Rating"]), borderColor: 'rgb(153, 12, 236)', backgroundColor: 'rgba(153, 12, 236, 0.5)'}]}}
        />
    </main>
  )
}

export default Dashboard
