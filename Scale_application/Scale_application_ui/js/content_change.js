window.onpopstate = function()
{
	if(document.location.pathname == '/')
	{
		document.title = 'Product categories';
	}
	else if(document.location.pathname.slice(1) == 'product_creation')
	{
		document.title = 'Product creation';
	}
	else if(document.location.pathname.slice(1) == 'list_of_products')
	{
		document.title = 'List of products';
	}
	else if(document.location.pathname.slice(1) == 'view_product')
	{
		document.title = 'View product';
	}

	var request = new XMLHttpRequest;
	if(document.location.pathname == '/')
	{
		var url = 'index.html';
	}
	else
	{
		var url = document.location.pathname + '/index.html';
	}
	request.open('GET', url);
	request.onreadystatechange = function()
	{
    	if(request.readyState == 4 && request.status == 200)
    	{
			document.getElementById('container').innerHTML = request.responseText;
    	}
    	else
    	{
    		document.getElementById('container').innerHTML = '<h1>Error: ' + request.status + '</h1>';
    	}

		document.getElementById('container').style.opacity = '1';
	};
	request.send();
}

function content_change(content_id)
{
	document.getElementById('container').innerHTML = '<div id="loader" class="loader"></div>';
	event.preventDefault();

	if(content_id == 'home')
	{
		document.title = 'Product categories';
		//window.history.pushState( {} , 'Product categories', '/' );
	}
	else if(content_id == 'product_creation')
	{
		document.title = 'Product creation';
		//window.history.pushState( {} , 'Product creation', '/product_creation/index.html' );
	}
	else if(content_id == 'list_of_products')
	{
		document.title = 'List of products';
		//window.history.pushState( {} , 'List of products', '/list_of_products/index.html' );
	}
	else if(content_id == 'view_product')
	{
		document.title = 'View product';
		//window.history.pushState( {} , 'View product', '/view_product/index.html' );
	}

	document.getElementById('container').style.opacity = '0';

	var request = new XMLHttpRequest;
	var url = content_id + '/index.html';

    setTimeout(function()
	{
		request.open('GET', url);
		request.onreadystatechange = function()
		{
	    	if(request.readyState == 4 && request.status == 200)
	    	{
				document.getElementById('container').innerHTML = request.responseText;
	    	}
	    	else
	    	{
	    		document.getElementById('container').innerHTML = '<h1>Error: ' + request.status + '</h1>';
	    	}

			document.getElementById('container').style.opacity = '1';
		};
		request.send();
	}, 500);
}