const container = document.getElementById('categories_creation');
const cancel_button = document.getElementById('cancel_button');
const add_category = document.getElementById('add_category');
const category_name = document.getElementById('category_name');
let additional_name = document.getElementsByClassName('additional_name');
let additional_datatype = document.getElementsByClassName('additional_datatype');
const save_button = document.getElementById('save_button');
const categories_container = document.querySelector('#categories_container');
let fields_amount = 0;
let categories_list = '';

add_category.addEventListener("click", function()
{
	container.style.visibility = "visible";
	category_name.value = "";

	for(var i = 0; i < fields_amount; i++)
	{
		document.getElementById('additional_name_' + i).remove();
		document.getElementById('additional_datatype_' + i).remove();
	}

	fields_amount = 0;
});
Display_categories();

function Add_input()
{
	let input = document.createElement('input');
	input.id = "additional_name_" + fields_amount;
	input.classList.add("additional_name");
	input.placeholder = 'Add additional field name';
	container.appendChild(input);

	//Create array of options to be added
	var array = ["varchar(50)","int(12)","decimal(10, 2)"];

	//Create and append select list
	var select_list = document.createElement("select");
	select_list.id = "additional_datatype_" + fields_amount;
	select_list.classList.add("additional_datatype");
	container.appendChild(select_list);

	//Create and append the options
	for (var i = 0; i < array.length; i++)
	{
	    var option = document.createElement("option");
	    option.value = array[i];
	    option.text = array[i];
	    select_list.appendChild(option);
	}

	fields_amount++;
}

async function Display_categories()
{
	await fetch('https://localhost:7238/api/categories').then((response) => {return response.json();}).then((data) =>
	{
		let all_categories = '';

		data.value.forEach(category =>
		{
			const category_element = `<div class="category" data-id="${category}"><svg id="delete_category" onclick="Delete_category('${category}');" fill-rule="evenodd" viewBox="0 0 24 24" height="25"><path d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"/></svg><h3>${category}</h3></div>`;
			all_categories += category_element;
		});

		categories_container.innerHTML = all_categories;
	});
}

async function Add_category()
{
	var fields_dictionary = new Object();
	fields_dictionary["CategoryName"] = category_name.value;

	for(var i = 0; i < additional_name.length; i++)
	{
    	fields_dictionary[additional_name[i].value] = additional_datatype[i].options[additional_datatype[i].selectedIndex].value;
	}

	await fetch('https://localhost:7238/api/categories',
	{
	    method: "POST",
	    //body: JSON.stringify({name: category_name.value, additionalFieldName: additional_name.value, additionalFieldDatatype: additional_datatype.options[additional_datatype.selectedIndex].value}),
	    body: JSON.stringify(fields_dictionary),
	    headers: { 'content-type': 'application/json' }
	});

	container.style.visibility = "hidden";
	Display_categories();
}

async function Delete_category(category_name)
{
    let response = confirm("Are you sure to delete category: " + category_name + "?");

    if(response)
    {
		await fetch('https://localhost:7238/api/categories',
		{
		    method: "DELETE",
		    body: JSON.stringify({categoryName: category_name}),
		    headers: { 'content-type': 'application/json' }
		});

		Display_categories();
    }
    else { }
}