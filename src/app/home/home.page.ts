import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  // Importar para hacer peticiones HTTP
import { jsPDF } from 'jspdf';  // Para generar PDFs
import Chart from 'chart.js/auto';  // Para los gráficos

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';  // API de CoinGecko para obtener las 10 principales criptomonedas
  chartData: any[] = [];  // Para almacenar los datos que recibimos de la API

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();  // Llamar a la función para obtener los datos cuando el componente se inicie
  }

  // Función para hacer la solicitud a la API de CoinGecko
  fetchData() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.chartData = data;  // Guardar los datos obtenidos de la API
      this.createCharts();  // Crear los gráficos
    });
  }

  // Función para crear los gráficos con Chart.js
  createCharts() {
    // Gráfico de barras (por ejemplo, el precio de cada criptomoneda)
    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: this.chartData.map(d => d.name),  // Usamos el nombre de la criptomoneda
        datasets: [{
          label: 'Price in USD',
          data: this.chartData.map(d => d.current_price),  // Usamos el precio actual
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      }
    });

    // Gráfico de líneas (por ejemplo, la capitalización de mercado)
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: this.chartData.map(d => d.name),
        datasets: [{
          label: 'Market Cap (USD)',
          data: this.chartData.map(d => d.market_cap),
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: false
        }]
      }
    });

    // Gráfico de tarta (por ejemplo, volumen negociado)
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: this.chartData.map(d => d.name),
        datasets: [{
          label: '24h Trading Volume',
          data: this.chartData.map(d => d.total_volume),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ]
        }]
      }
    });
  }

  // Función para generar el PDF
  generatePDF() {
    const pdf = new jsPDF();

    // Título del informe
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text('Cryptocurrency Report', 10, 10);

    // Información sobre criptomonedas
    pdf.setFontSize(12);
    pdf.text('This is a report based on the current top 10 cryptocurrencies by market capitalization.', 10, 20);

    let yOffset = 40;
    this.chartData.forEach((item, index) => {
      if (index < 5) {  // Solo mostrar los primeros 5 resultados
        pdf.text(`Name: ${item.name}`, 10, yOffset);
        pdf.text(`Current Price: $${item.current_price}`, 10, yOffset + 10);
        pdf.text(`Market Cap: $${item.market_cap}`, 10, yOffset + 20);
        pdf.text(`24h Volume: $${item.total_volume}`, 10, yOffset + 30);
        yOffset += 40;
      }
    });

    // Agregar los gráficos
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Graphs of Cryptocurrency Data', 10, 10);

    // Gráfico de barras
    const barChartImage = document.getElementById('barChart') as HTMLCanvasElement;
    const barChartDataUrl = barChartImage.toDataURL('image/png');
    pdf.addImage(barChartDataUrl, 'PNG', 10, 30, 180, 80);

    // Gráfico de líneas
    const lineChartImage = document.getElementById('lineChart') as HTMLCanvasElement;
    const lineChartDataUrl = lineChartImage.toDataURL('image/png');
    pdf.addImage(lineChartDataUrl, 'PNG', 10, 120, 180, 80);

    // Gráfico de tarta
    const pieChartImage = document.getElementById('pieChart') as HTMLCanvasElement;
    const pieChartDataUrl = pieChartImage.toDataURL('image/png');
    pdf.addImage(pieChartDataUrl, 'PNG', 10, 210, 180, 80);

    // Descargar el PDF
    pdf.save('Cryptocurrency_Report.pdf');
  }
}
