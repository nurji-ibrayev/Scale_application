const container = document.getElementById('categories_creation');
const cancelButton = document.getElementById('cancel_button');
const addCategoryButton = document.getElementById('add_category_button');
const categoryName = document.getElementById('category_name');
let additionalName = document.getElementsByClassName('additional_name');
let additionalDatatype = document.getElementsByClassName('additional_datatype');
const saveButton = document.getElementById('save_button');
const categoriesContainer = document.querySelector('#categories_container');
let fieldsAmount = 0;
let categoriesList = '';

addCategoryButton.addEventListener("click", function()
{
	container.style.visibility = "visible";
	categoryName.value = "";

	for(var i = 0; i < fieldsAmount; i++)
	{
		document.getElementById('additional_name_' + i).remove();
		document.getElementById('additional_datatype_' + i).remove();
	}

	fieldsAmount = 0;
});
displayCategories();

function addInput()
{
	let input = document.createElement('input');
	input.id = "additional_name_" + fieldsAmount;
	input.classList.add("additional_name");
	input.placeholder = 'Add additional field name';
	container.appendChild(input);

	//Create array of options to be added
	var array = ["varchar(50)","int(12)","decimal(10, 2)"];

	//Create and append select list
	var select_list = document.createElement("select");
	select_list.id = "additional_datatype_" + fieldsAmount;
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

	fieldsAmount++;
}

async function displayCategories()
{
	await fetch('https://localhost:7238/api/categories').then((response) => {return response.json();}).then((data) =>
	{
		let allCategories = '';

		data.value.forEach(category =>
		{
			const categoryElement = `<div class="category" data-id="${category}"><svg id="delete_category" onclick="deleteCategory('${category}');" fill-rule="evenodd" viewBox="0 0 24 24" height="25"><path d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"/></svg><h3>${category}</h3></div>`;
			allCategories += categoryElement;
		});

		categoriesContainer.innerHTML = allCategories;
	});
}

async function addCategory()
{
	var fieldsDictionary = new Object();
	fieldsDictionary["CategoryName"] = categoryName.value;

	for(var i = 0; i < additionalName.length; i++)
	{
    	fieldsDictionary[additionalName[i].value] = additionalDatatype[i].options[additionalDatatype[i].selectedIndex].value;
	}

	await fetch('https://localhost:7238/api/categories',
	{
	    method: "POST",
	    body: JSON.stringify(fieldsDictionary),
	    headers: { 'content-type': 'application/json' }
	});

	container.style.visibility = "hidden";
	displayCategories();
}

async function deleteCategory(categoryName)
{
    let response = confirm("Are you sure to delete category: " + categoryName + "?");

    if(response)
    {
		await fetch('https://localhost:7238/api/categories',
		{
		    method: "DELETE",
		    body: JSON.stringify({categoryName: categoryName}),
		    headers: { 'content-type': 'application/json' }
		});

		displayCategories();
    }
    else { }
}