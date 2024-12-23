import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface Order {
  id: string;
  customerId: string;
  orderDate: Date;
  totalAmount: number;
  status: number;
  orderItems: [];
}

const ELEMENT_DATA: Order[] = [];

interface Product {
  productName: string;
  quantity: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTableModule, MatInputModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  status!: string;
  quantidade!: string;
  nome!: string;
  showErrorStatus = false;
  showErrorProduct = false;
  showErrorEndpoint = false;

  products: Product[] = [];

  displayedColumns: string[] = [
    'btnEliminar',
    'btnEditar',
    'customerId',
    'orderDate',
    'totalAmount',
    'status',
  ];
  dataSource = ELEMENT_DATA;

  constructor(private api: ApiService) {
    this.loadOrders();
  }

  loadOrders(): void {
    this.api.getOrders().subscribe(
      (data) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  addOrder() {
    this.products = [];
    if (
      this.quantidade === undefined ||
      this.quantidade === null ||
      this.quantidade === '' ||
      this.nome === undefined ||
      this.nome === null ||
      this.nome === ''
    ) {
      this.showErrorProduct = true;
    } else {
      this.showErrorProduct = false;
      if (this.nome.includes(';') && this.quantidade.includes(';')) {
        const nameList = this.nome.split(';').map((item) => item.trim());
        const quantityList = this.quantidade
          .split(';')
          .map((item) => parseInt(item.trim(), 10));
        if (nameList.length === quantityList.length) {
          this.products = nameList.map((name, index) => ({
            productName: name,
            quantity: quantityList[index],
          }));
        }
      } else {
        this.products.push({
          productName: this.nome,
          quantity: parseInt(this.quantidade, 10),
        });
      }
      this.api.addOrder({ orderItems: this.products }).subscribe(
        (data) => {
          console.log('Produto adicionado:', data);
          this.loadOrders();
        },
        (error) => {
          console.error('Erro ao adicionar produto', error);
        }
      );
    }
  }

  deleteOrder(id: any) {
    this.showErrorEndpoint = false;
    console.log(id);
    this.api.deleteOrder(id).subscribe(
      (data) => {
        this.loadOrders();
      },
      (error) => {
        console.error('Erro ao adicionar produto', error);
        this.showErrorEndpoint = true;
      }
    );
  }

  editStatus(id: any) {
    this.showErrorEndpoint = false;
    if (
      this.status === undefined ||
      this.status === null ||
      this.status === ''
    ) {
      this.showErrorStatus = true;
    } else {
      this.showErrorStatus = false;
      this.api.editOrder(id, parseInt(this.status, 10)).subscribe(
        (data) => {
          this.loadOrders();
        },
        (error) => {
          console.error('Erro ao adicionar produto', error);
          this.showErrorEndpoint = true;
        }
      );
    }
  }
}
