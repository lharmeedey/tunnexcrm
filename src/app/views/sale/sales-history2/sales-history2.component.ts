import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../services/sale.service';
import { CustomerService } from '../../../services/customer.service';
import { Formats } from '../../../classes/print';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-history2',
  templateUrl: './sales-history2.component.html',
  styleUrls: ['./sales-history2.component.css']
})
export class SalesHistory2Component implements OnInit {

  sales:any[] = []
  customers:any[] = []
  loadingReport:boolean = false
  format = new Formats()
  today
  filterVal

  constructor(
    private saleService:SaleService,
    private customerService:CustomerService,
    private router:Router
  ) { 
    let d = new Date()
    let day:any = d.getDate()
    let month:any = d.getMonth()+1
    let year:any = d.getFullYear()
    if(day<10){
      day = `0${day}`
    }
    if(month<10){
      month = `0${month}`
    }
    this.today = `${day}-${month}-${year}`
  }

  ngOnInit(): void {
    this.getCustomers()
    // this.getSales()
    // this.getSalesByDate(this.today)
    this.getSalesByCustStartandEndDate(0,0,0)
  }

  getSalesByCustStartandEndDate(customerID,startDate,endDate){
    this.loadingReport = true
    this.saleService.getSalesHistoryByCustomerStarDateEndDate(customerID,startDate,endDate).subscribe(data=>{
      this.loadingReport = false
      console.log(data)
      this.sales = <any[]>data
    },
      err=>{
        this.loadingReport = false
        console.log(err)
      })
  }

  refresh(){
    this.getSalesByCustStartandEndDate(0,0,0)
  }

  test(){
    this.format.printDiv('toPrint')
  }

  // refresh(){
  //   this.getSalesByDate(this.today)
  // }

  filterSales(){
    let d = this.filterVal.split('-')
    let newDate = `${d[2]}-${d[1]}-${d[0]}`
    this.getSalesByDate(newDate)
  }

  getSalesByDate(date){
    this.loadingReport = true
    // '28-05-2020'
    this.saleService.getSalesByDate(date).subscribe(data=>{
      this.sales = <any[]>data
      this.loadingReport = false
    },
      err=>{
        this.loadingReport = false
      })
  }

  getCustomers(){
    this.customerService.getAllCustomers().subscribe(data=>{
      this.customers = <any[]>data
      this.customers.forEach(cust=>cust.fullName = `${cust.firstName} ${cust.lastName}`)
    })
  }

  getCustomerName(id){
    try{
    let customer = this.customers.find(x=>x.id == id)
    return `${customer.firstName} ${customer.lastName}`
    }
    catch{
      return `Guest Customer`
    }
  }

  print(id){
    this.format.printDiv(id)
  }

  openInvoice(customerID,invoiceNo){
    console.log(customerID,invoiceNo)
    this.router.navigateByUrl(`/main/invoice/${customerID}/${invoiceNo}`)
  }

}