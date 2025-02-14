Proiektu hau kriptomoneta-taula dinamikoa da, Ionic eta Angular erabiliz garatua. CoinGecko API-a erabiltzen du, kriptomoneta nagusien egoera errealeko datuak jasotzeko eta Chart.js erabiliz grafiko interaktiboak erakusteko. Horrez gain, jsPDF erabiliz PDF formatuan txostena sortzeko aukera ere badago.

Ezaugarriak
Datuen bistaratzea: Hiru grafiko mota interaktibo (barra, linea eta tartarako) kriptomoneten inguruko informazio desberdina erakusten dutenak.

Barra grafikoa: Kriptomoneten egungo prezioa.
Linea grafikoa: Kriptomoneten merkatu kapitalizazioa.
Tarta grafikoa: Kriptomoneten azken 24 ordutan egindako truke bolumena.
PDF txostena sortzea: PDF formatuan txostena deskargatzeko aukera, datuak eta grafikoak barne.

Teknologiak
Ionic Framework: Aplikazio mugikorra sortzeko.
Angular: Aplikazioaren egitura.
Chart.js: Grafiko interaktiboak sortzeko.
jsPDF: PDF formatuan txostenak sortzeko.
Instalazioa
Hemen daude proiektua zure makina lokal batean instalatzeko eta exekutatzeko urratsak.


SARTU VISUALERA
git clone https://github.com/usuario/repo.git
cd repo
2. Dependentzietako instalazioa
Hurrengo komandoa exekutatu, beharrezko dependenteak instalatzeko:

npm install
3. Aplikazioa exekutatzea
Dependenteak instalatuta daudenean, aplikazioa zure zerbitzari lokal batean exekutatu dezakezu:


ionic serve
Horrek aplikazioa zure nabigatzailean irekiko du. Era berean, gailu batean edo emuladore batean ere probatu dezakezu.

Erabilera
Datuak kargatzea: Aplikazioa abiaraztean, CoinGecko API-ra eskaera bat egiten da, merkatu kapitalizazioaren arabera lehenengo 10 kriptomoneten datuak lortzeko.

Grafikoak ikustea: Barra, linea eta tarta grafikoak automatikoki eguneratzen dira API-tik lortutako datuekin.

PDF txostena sortzea: "Download PDF Report" botoian klik eginez, PDF formatuan txosten bat sortuko da, grafiko eta datu guztiekin.
Kodearen azalpena

home.page.ts
Fitxategi honek aplikazioaren logika nagusia biltzen du. API-ra eskaera bat egiten du, datuak prozesatzen ditu eta grafikoak sortzen ditu:

fetchData: CoinGecko API-ra GET eskaera bat egiten du eta 10 kriptomoneta nagusien datuak jasotzen ditu.

createCharts: Chart.js erabiliz hiru grafiko sortzen ditu (barra, linea eta tarta). 
Grafikoek hurrengo informazioa erakusten dute:
Egungo prezioa (USD).
Merkatu kapitalizazioa.
Azken 24 ordutan egindako bolumena.

generatePDF: PDF formatuan txostena sortzen du, datuak eta grafikoak barne. jsPDF erabiltzen du fitxategi PDF sortzeko eta deskargatzeko.
home.page.html
Fitxategi honek erabiltzailearen interfazearen egitura definitzen du (UI). Grafikoak eta PDF txostenaren botoia erakusteko erabiltzen da.


html-a:

<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>Cryptocurrency Report</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Cryptocurrency Data</ion-title>
    </ion-toolbar>
  </ion-header>

  <div>
    <h2>Cryptocurrency Dashboard</h2>
    <canvas id="barChart"></canvas>
    <canvas id="lineChart"></canvas>
    <canvas id="pieChart"></canvas>
    <ion-button expand="full" (click)="generatePDF()">Download PDF Report</ion-button>
  </div>
</ion-content>
styles.css
Fitxategi honek aplikazioaren estilo globalak definitzen ditu, grafikoen eta PDF botoiaren estiloak barne.

css-a:

ion-button {
  margin-top: 20px;
}

canvas {
  margin: 20px 0;
  max-width: 100%;
}

h2 {
  text-align: center;
}


home.page.ts:

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  // Definir la URL de la API pública que proporciona los datos de las criptomonedas
  apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,polkadot,binancecoin,litecoin,ripple,solana,uniswap,chainlink';
  // Variable para almacenar los datos de las criptomonedas que recibimos de la API
  chartData: any[] = [];

  constructor(private http: HttpClient) {}

  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit() {
    this.fetchData();  // Llamada para obtener los datos de las criptomonedas desde la API
  }

  // Método para obtener los datos de la API
  fetchData() {
    // Realizamos la solicitud GET a la API para obtener la información de las criptomonedas
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.chartData = data;  // Almacenamos los datos obtenidos en la variable chartData
      this.createCharts();  // Creamos los gráficos con los datos recibidos
    });
  }

  // Método para crear los gráficos con Chart.js
  createCharts() {
    // Crear el gráfico de barras para mostrar el precio actual de las criptomonedas
    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(barCtx, {
      type: 'bar',  // Tipo de gráfico (barra)
      data: {
        labels: this.chartData.map(d => d.name),  // Usamos los nombres de las criptomonedas como etiquetas en el gráfico
        datasets: [{
          label: 'Precio Actual (USD)',  // Etiqueta de la serie de datos
          data: this.chartData.map(d => d.current_price),  // Extraemos los precios actuales de las criptomonedas
          backgroundColor: 'rgba(75, 192, 192, 0.6)'  // Color de fondo de las barras
        }]
      }
    });

    // Crear el gráfico de líneas para mostrar la capitalización de mercado de las criptomonedas
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(lineCtx, {
      type: 'line',  // Tipo de gráfico (línea)
      data: {
        labels: this.chartData.map(d => d.name),  // Usamos los nombres de las criptomonedas como etiquetas
        datasets: [{
          label: 'Capitalización de Mercado (USD)',  // Etiqueta de la serie de datos
          data: this.chartData.map(d => d.market_cap),  // Extraemos la capitalización de mercado de las criptomonedas
          borderColor: 'rgba(54, 162, 235, 1)',  // Color de la línea
          fill: false  // No rellenamos el área bajo la línea
        }]
      }
    });

    // Crear el gráfico de tarta para mostrar el volumen de las últimas 24 horas de las criptomonedas
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    new Chart(pieCtx, {
      type: 'pie',  // Tipo de gráfico (tarta)
      data: {
        labels: this.chartData.map(d => d.name),  // Usamos los nombres de las criptomonedas como etiquetas
        datasets: [{
          label: 'Volumen 24h (USD)',  // Etiqueta de la serie de datos
          data: this.chartData.map(d => d.total_volume),  // Extraemos el volumen de las últimas 24 horas de las criptomonedas
          backgroundColor: [  // Colores de las secciones de la tarta
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ]
        }]
      }
    });
  }

  // Método para generar y descargar el PDF con los datos de las criptomonedas
  generatePDF() {
    const pdf = new jsPDF();  // Crear un nuevo documento PDF

    pdf.text('Cryptocurrency Report', 10, 10);  // Título del informe
    pdf.addImage('https://via.placeholder.com/150', 'JPEG', 150, 10, 40, 40);  // Añadir una imagen al PDF (logo o similar)

    let yOffset = 60;  // Variable para manejar el desplazamiento vertical en el PDF
    this.chartData.forEach((item, index) => {
      if (index < 5) {  // Solo mostramos los primeros 5 elementos
        pdf.text(`Name: ${item.name}`, 10, yOffset);  // Mostrar el nombre de la criptomoneda
        pdf.text(`Price: $${item.current_price}`, 10, yOffset + 10);  // Mostrar el precio actual de la criptomoneda
        pdf.text(`Market Cap: $${item.market_cap}`, 10, yOffset + 20);  // Mostrar la capitalización de mercado
        pdf.text(`24h Volume: $${item.total_volume}`, 10, yOffset + 30);  // Mostrar el volumen de las últimas 24 horas
        yOffset += 40;  // Incrementar el desplazamiento para la siguiente criptomoneda
      }
    });

    pdf.save('Cryptocurrency_Report.pdf');  // Guardar el PDF con el nombre especificado
  }
}
