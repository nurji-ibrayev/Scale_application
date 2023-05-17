using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Scale_application.Data;
using Scale_application.Models.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Drawing;
using System.Net;
using System.Reflection.PortableExecutable;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.Mime.MediaTypeNames;

namespace Scale_application.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly ProductsDbContext productsDbContext;

        public ProductsController(ProductsDbContext categoriesDbContext)
        {
            this.productsDbContext = categoriesDbContext;
        }

        [HttpGet]
        public JsonResult GetAllProducts()
        {
            SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb");

            try
            {
                connection.Open();
                List<Dictionary<string, string>> productsList = new List<Dictionary<string, string>>();

                // Get all table names from database
                DataTable tablesDataTable = connection.GetSchema("Tables");

                IList<string> tablesName = new List<string>();
                foreach (DataRow row in tablesDataTable.Rows)
                {
                    string tableName = (string)row[2];
                    tablesName.Add(tableName);
                }

                foreach (string tableName in tablesName)
                {
                    // Get table columns
                    SqlCommand getTableData = new SqlCommand($"SELECT * FROM {tableName} WHERE 1=0", connection);
                    SqlDataReader tableDataReader = getTableData.ExecuteReader();
                    DataTable tableSchema = tableDataReader.GetSchemaTable();
                    tableDataReader.Close();

                    // Get table rows
                    string columnNames = new string(new char[] {});
                    foreach (DataRow column in tableSchema.Rows)
                    {
                        columnNames += $",{column.Field<string>("ColumnName")}";
                    }
                    SqlCommand getTableRows = new SqlCommand($"SELECT {columnNames.Substring(1)} FROM {tableName}", connection);
                    SqlDataReader tableRowsReader = getTableRows.ExecuteReader();

                    // Read row values and add to list
                    while (tableRowsReader.Read())
                    {
                        Dictionary<string, string> categoryFields = new Dictionary<string, string>();
                        categoryFields["CategoryName"] = tableName;

                        foreach (DataRow column in tableSchema.Rows)
                        {
                            categoryFields[column.Field<string>("ColumnName")] = tableRowsReader[column.Field<string>("ColumnName")].ToString();
                        }

                        productsList.Add(categoryFields);
                    }
                    tableRowsReader.Close();
                }
                connection.Close();

                return new JsonResult(Ok(productsList));
            }
            catch (Exception exception)
            {
                return new JsonResult(exception.Message, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet]
        [Route("{categoryName}")]
        public JsonResult GetCatergoryFields([FromRoute] string categoryName)
        {
            try
            {
                Dictionary<string, string> categoryFields = new Dictionary<string, string>();

                using (SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb"))
                {
                    connection.Open();

                    SqlCommand sqlCommand = new SqlCommand($"SELECT * FROM {categoryName} WHERE 1=0", connection);

                    DataTable dataTable = sqlCommand.ExecuteReader().GetSchemaTable();

                    foreach (DataRow column in dataTable.Rows)
                    {
                        categoryFields[column.Field<string>("ColumnName")] = column["ProviderSpecificDataType"].ToString().Replace("System.Data.SqlTypes.Sql", string.Empty);
                    }
                }

                return new JsonResult(Ok(categoryFields));
            }
            catch(Exception exception)
            {
                return new JsonResult(exception.Message, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet]
        [Route("{categoryName}&{id}")]
        public JsonResult GetProductById([FromRoute] string categoryName, [FromRoute] int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb"))
                {
                    connection.Open();

                    // Get table columns
                    SqlCommand getTableData = new SqlCommand($"SELECT * FROM {categoryName} WHERE 1=0", connection);
                    SqlDataReader tableDataReader = getTableData.ExecuteReader();
                    DataTable tableSchema = tableDataReader.GetSchemaTable();
                    tableDataReader.Close();

                    SqlCommand command = new SqlCommand($"SELECT * FROM {categoryName} WHERE ID='{id}'", connection);
                    SqlDataReader dataReader = command.ExecuteReader();

                    // Get table rows
                    Dictionary<string, string> productFields = new Dictionary<string, string>();
                    if (dataReader.Read())
                    {
                        foreach (DataRow column in tableSchema.Rows)
                        {
                            productFields[column.Field<string>("ColumnName")] = dataReader[column.Field<string>("ColumnName")].ToString();
                        }
                    }

                    return new JsonResult(Ok(productFields));
                }
            }
            catch (Exception exception)
            {
                return new JsonResult(exception.Message, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost]
        public JsonResult AddProduct(Dictionary<string, string> additionalFields)
        {
            string fieldsName = new string(new char[] {});
            string fieldsValue = new string(new char[] { });

            foreach (KeyValuePair<string, string> additionalField in additionalFields)
            {
                fieldsName += $",{additionalField.Key}";
                fieldsValue += $",'{additionalField.Value}'";
            }

            try
            {
                using (SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb"))
                {
                    connection.Open();
                    SqlCommand sqlCommand = new SqlCommand($"INSERT INTO {additionalFields["CategoryName"]}({fieldsName.Substring(1)}) VALUES({fieldsValue.Substring(1)})", connection);
                    sqlCommand.ExecuteNonQuery();
                }

                return new JsonResult(Ok($"{additionalFields["Name"]} successfully inserted into {additionalFields["CategoryName"]}"));
            }
            catch (Exception exception)
            {
                return new JsonResult(exception.Message, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete]
        [Route("{categoryName}&{id}")]
        public JsonResult DeleteProduct([FromRoute] string categoryName, [FromRoute] int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb"))
                {
                    connection.Open();
                    SqlCommand sqlCommand = new SqlCommand($"DELETE FROM {categoryName} WHERE ID='{id}';", connection);
                    sqlCommand.ExecuteNonQuery();
                }

                return new JsonResult(Ok($"Row with ID: {id} successfully deleted from {categoryName}"));
            }
            catch(Exception exception)
            {
                return new JsonResult(exception.Message, HttpStatusCode.InternalServerError);
            }
        }
    }
}
