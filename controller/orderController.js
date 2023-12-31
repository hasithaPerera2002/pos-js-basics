import {OrderDetails} from "../modules/orderDetails.js";
import {getNewOrderID, saveOrder} from "../DB/orderDb.js";
import {getItems} from "../DB/itemDb.js";
import {getCustomers} from "../DB/customerDb.js";
import {Order} from "../modules/order.js";

export class OrderController {
    constructor() {

        this.orderList = [];

        $('#addBtn').click(this.handleSaveOrder.bind(this));
        $('#updateBtn').click(this.handleUpdateOrder.bind(this));
        $('#deleteBtn').click(this.handleDeleteOrder.bind(this));
        $('#clearBtn').click(this.clearOrder.bind(this));
        $('#addOrderBtn').click(this.placeOrder.bind(this));
        $('#table_body').click(this.handleTblOrder.bind(this));
        $('#customerID').click(this.loadCustomerName.bind(this))
        $('#itemID').click(this.loadItemName.bind(this));
        $('#quantity').on('input', this.calculateTotal.bind(this));
        $('#orderDate').val(new Date().toLocaleDateString())

        this.loadCustomer()
        this.loadItems()
        this.loopData()

        $('#orderId').val(getNewOrderID())

        $('#orderId').prop("disabled", true)
        $('#price').prop("disabled", true)
        $('#itemName').prop("disabled", true)
        $('#custName').prop("disabled", true)
        $('#total').prop("disabled", true)
    }

    clearOrder(e) {
        e.preventDefault()

        $('#customerID').val('');
        $('#itemID').val('');
        $('#custName').val('');
        $('#itemName').val('');
        $('#quantity').val('');
        $('#total').val('');
        $('#price').val('');

    }

    loadItems() {
        let items = getItems();
        let itemID = $('#itemID');
        itemID.empty();


        items.forEach(item => {
            itemID.append($('<option>').val(JSON.stringify(item)).text(item._i_id));
        })

    }

    loadItemName() {
        let selectedOption = $('#itemID').val();
        let selectedItem = JSON.parse(selectedOption);
        $('#itemName').val(selectedItem._i_name);
        $('#price').val(selectedItem._price);
        $('#qtyOnHand').val(selectedItem._qty);
    }

    newId() {

    }

    loadCustomer() {
        let customers = getCustomers();
        let customerID = $('#customerID');
        customerID.empty()
        customers.forEach(customers => {
            customerID.append($('<option>').val(JSON.stringify(customers)).text(customers._c_id))
        })
    }

    loadCustomerName() {
        let selectedOption = $('#customerID').val();
        let selectedCustomer = JSON.parse(selectedOption);
        $('#custName').val(selectedCustomer._fname);
        $('#customerAddress').val(selectedCustomer._address);

    }


    handleSaveOrder(e) {
        e.preventDefault()
        let orderId = $('#orderId').val();
        let customerId = JSON.parse($('#customerID').val())._c_id;
        let itemId = JSON.parse($('#itemID').val())._i_id;
        let qty = parseInt($('#quantity').val());
        let total = parseInt($('#total').val());
        let price = $('#price').val();

        if ( !orderId || !customerId || !itemId || !qty || !total || !price) {

            console.log(customerId)
            console.log(itemId)
            console.log(qty)
            console.log(total)
            console.log(price)
            alert(('Please fill in all fields'));

            return;
        }

        let existingOrder = this.orderList.find(order => (order._item_id === itemId));
        if (existingOrder) {

            existingOrder._quantity += qty;
            existingOrder._total += total;
        } else {

            let newOrder = new OrderDetails(orderId, customerId, itemId, qty, price, total);
            this.orderList.push(newOrder);
        }
        this.loopData()
        this.calculateOrderTotal()
    }

    handleUpdateOrder(e) {
        //kadila theene

        e.preventDefault()
    }

    handleDeleteOrder(e) {
        e.preventDefault();

        let itemId = $('#itemID').val();
        let index = this.orderList.findIndex(order => order._item_id === itemId);

        if (index !== -1) {
            this.orderList.splice(index, 1);
            this.loopData();
            this.calculateOrderTotal();
        }
    }

    loopData() {
        let list = this.orderList;
        $('#table_body').empty();
        list.forEach((orderDetails) => {
            $('#table_body').append(
                `<tr>
                    <td>${orderDetails._order_id}</td>
                    <td>${orderDetails._cus_id}</td>
                    <td>${orderDetails._item_id}</td>
                    <td>${orderDetails._quantity}</td>
                    <td>${orderDetails._total}</td>
                </tr> `
            )
        })
    }

    handleTblOrder(e) {
        //kadila
        $('#orderId').text($(e.target).closest('tr').find('td').eq(0).text());
        $('#customerID').text($(e.target).closest('tr').find('td').eq(1).text());
        $('#custName').text($(e.target).closest('tr').find('td').eq(2).text());
        $('#itemName').text($(e.target).closest('tr').find('td').eq(4).text());
        $('#price').text($(e.target).closest('tr').find('td').eq(3).val());
        $('#quantity').text($(e.target).closest('tr').find('td').eq(5).text());
        $('#itemID').val($(e.target).closest('tr').find('td').eq(6).text());
        $('#total').text($(e.target).closest('tr').find('td').eq(7).text());


        $('#addBtn').prop('disabled', true)
    }

    placeOrder() {
        let order = saveOrder(new Order(this.orderList,$('#orderTotal').val()));
        (order) ? alert("order added successfully") : alert("error when saving order")
        this.clearOrder()
    }

    calculateTotal() {
        let qty = $('#quantity').val();
        let price = $('#price').val();

        if (qty && price) {
            let total = qty * price;
            $('#total').val(total);
        }
    }

    calculateOrderTotal() {
        let total = 0;
        this.orderList.forEach((order) => {
            total += parseInt(order._total);
        })
        $('#orderTotal').val(total);
        console.log(total)
    }
}

new OrderController()