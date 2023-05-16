const category_selection = document.getElementById('category_selection');
const product_creation = document.getElementById('product_creation');
const creation_status = document.getElementById('creation_status');
const products_container = document.getElementById('products_container');
let products_list = [];

function Category_selection_changed()
{
	let additional_fields = document.getElementsByClassName('additional_fields');

	for(var i = additional_fields.length - 1; i >= 0; i--)
	{
        additional_fields[i].parentNode.removeChild(additional_fields[i]);
	}

    Get_categories_fields(category_selection.options[category_selection.selectedIndex].value);
}

async function Get_categories_list()
{
	let categories_list = [];

	await fetch('https://localhost:7238/api/categories').then((response) => {return response.json();}).then((data) =>
	{
		data.value.forEach(category =>
		{
			categories_list.push(category);
		});
	});

	for (var i = 0; i < categories_list.length; i++)
	{
	    var option = document.createElement("option");
	    option.value = categories_list[i];
	    option.text = categories_list[i];
	    category_selection.appendChild(option);
	}

	//Get_categories_fields(category_selection.options[category_selection.selectedIndex].value);
}

async function Get_categories_fields(category_name)
{
	fields_amount = 0;

	await fetch(`https://localhost:7238/api/Products/${category_name}`).then((response) => {return response.json();}).then((data) =>
	{
		Object.keys(data.value).forEach(field_name =>
		{
			if(field_name != "ID" && field_name != "CategoryName")
			{
				var label = document.createElement('label');
				label.classList.add("additional_fields");
				label.innerHTML = field_name;
				product_creation.appendChild(label);

				let input = document.createElement('input');
				input.id = field_name;
				input.classList.add("additional_fields");
				input.placeholder = data.value[field_name];
				product_creation.appendChild(input);
			}
		});
	});
}

async function Insert_product()
{
	var fields_dictionary = new Object();
	fields_dictionary["CategoryName"] = category_selection.options[category_selection.selectedIndex].value;
	let additional_fields = document.getElementsByTagName('input');

	for(var additional_field of additional_fields)
	{
    	fields_dictionary[additional_field.id] = additional_field.value;
	}

	var response_status;
	await fetch('https://localhost:7238/api/products',
	{
	    method: "POST",
	    body: JSON.stringify(fields_dictionary),
	    headers: { 'content-type': 'application/json' }
	}).then((response) => {return response.json();}).then((data) =>
	{
		creation_status.innerHTML = data.value;
	});

	creation_status.style.visibility = "visible";
	setTimeout(() => 
	{
		location.reload();
	}, 5000);
}

async function Display_products()
{
	await fetch('https://localhost:7238/api/products').then((response) => {return response.json();}).then((data) =>
	{
		let all_products = '';
		products_dictionary = data.value;

		data.value.forEach(product =>
		{
			const product_element = `<div class="product" data-id="${product["ID"]}" onclick="Load_page('${product["CategoryName"]}', ${product["ID"]})"><img src="${product["Image"]}"></img><h3>${product["Name"]}</h3><span>${product["Price"]} тг</span></div>`;
			all_products += product_element;
		});

		products_container.innerHTML = all_products;
	});
}

async function Display_product(category_name, id)
{
	await fetch(`https://localhost:7238/api/Products/${category_name}&${id}`).then((response) => {return response.json();}).then((data) => 
	{
		const product_image = document.getElementById('product_image');
		const product_information = document.getElementById('product_information');
		const product_category = document.getElementById('product_category');
		const product_name = document.getElementById('product_name');
		const product_price = document.getElementById('product_price');
		const product_description = document.getElementById('product_description');

		product_image.src = data.value["Image"]
		product_category.innerHTML = category_name;
		product_name.innerHTML = data.value["Name"];
		product_price.innerHTML = data.value["Price"] + " тг";
		product_description.innerHTML = data.value["Description"];

		for (var field_name of Object.keys(data.value))
		{
			if (field_name != "ID" && field_name != "Image" && field_name != "Name" && field_name != "Price" && field_name != "Description")
			{
				var label = document.createElement('label');
				label.classList.add("additional_fields");
				label.innerHTML = field_name + ":";
				product_information.appendChild(label);

				let span = document.createElement('span');
				span.classList.add("additional_fields");
				span.innerHTML = data.value[field_name];
				product_information.appendChild(span);
			}
		}
	});
}

function Load_page(category_name, id)
{
	document.body.innerHTML = '<!DOCTYPE html><head><meta charset="UTF-8"><title>Scale_application - View product</title><link rel="stylesheet" href="../style.css"></head><header><nav><a href="../index.html">Product categories</a><a href="../product_creation/index.html">Product creation</a><a href="../products_list/index.html">Products list</a><a href="#">View product</a></nav></header><body><div class="container"><h2>View product</h2><div class="product_view"><img id="product_image"><div class="product_information" id="product_information"><label>Category:</label><span id="product_category"></span><label>Name:</label><span id="product_name"></span><label>Price:</label><span id="product_price"></span><label>Description:</label><span id="product_description"></span></div></div></div><script src="../js/product.js"></script></body></html>';

	Display_product(category_name, id);
}

function Filter_products()
{
	let filtered_products = '';

	for (var product of products_dictionary)
	{
		if (category_selection.options[category_selection.selectedIndex].value != "All products")
		{
			if (product["CategoryName"] == category_selection.options[category_selection.selectedIndex].value)
			{
				const product_element = `<div class="product" data-id="${product["ID"]}" onclick="Load_page('${product["CategoryName"]}', ${product["ID"]})"><img src="${product["Image"]}"></img><h3>${product["Name"]}</h3><span>${product["Price"]} тг</span></div>`;
				filtered_products += product_element;
			}
		}
		else
		{
			Display_products();
		}
	}

	products_container.innerHTML = filtered_products;
}