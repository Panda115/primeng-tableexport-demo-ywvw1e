import { Component } from "@angular/core";
import { ProductService } from "./productservice";
import { Product } from "./product";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  products: Product[];

  selectedProducts: Product[];

  constructor(private productService: ProductService) {}

  cols: any[];

  exportColumns: any[];

  ngOnInit() {
    this.productService.getProductsSmall().then(data => (this.products = data));

    this.cols = [
      { field: "code", header: "Code" },
      { field: "name", header: "Name" },
      { field: "category", header: "Category" },
      { field: "quantity", header: "Quantity" }
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }
}
