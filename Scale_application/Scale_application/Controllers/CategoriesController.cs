using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Scale_application.Data;
using Scale_application.Models.Entities;
using System.Data;
using System.Net;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Scale_application.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : Controller
    {
        private readonly CategoriesDbContext categoriesDbContext;

        public CategoriesController(CategoriesDbContext categoriesDbContext)
        {
            this.categoriesDbContext = categoriesDbContext;
        }

        [HttpGet]
        public JsonResult GetAllTables()
        {
            SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb");

            connection.Open();
            DataTable dataTable = connection.GetSchema("Tables");

            IList<string> tablesName = new List<string>();
            foreach (DataRow row in dataTable.Rows)
            {
                string table_name = (string)row[2];
                tablesName.Add(table_name);
            }
            connection.Close();

            return new JsonResult(Ok(tablesName));
        }

        [HttpPost]
        public JsonResult CreateTable(Dictionary<string, string> additionalFields)
        {
            SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb");
            SqlCommand sqlCommand = new SqlCommand();

            if (additionalFields.Count > 1)
            {
                string command = $"CREATE TABLE {additionalFields["CategoryName"]}(ID int IDENTITY(1,1) NOT NULL,CategoryName varchar(50) NOT NULL,Name varchar(50) NOT NULL,Description varchar(128) NULL,Image nvarchar(260) NULL,Price int NOT NULL";

                foreach(string additional_field in additionalFields.Keys)
                {
                    if(additional_field != "CategoryName")
                    {
                        command += $",{additional_field} {additionalFields[additional_field]}";
                    }
                }

                sqlCommand = new SqlCommand($"{command});", connection);
            }
            else
            {
                sqlCommand = new SqlCommand($"CREATE TABLE {additionalFields["CategoryName"]}(ID int IDENTITY(1,1) NOT NULL,CategoryName varchar(50) NOT NULL,Name varchar(50) NOT NULL,Description varchar(128) NULL,Image nvarchar(260) NULL,Price int NOT NULL);", connection);
            }
            
            try
            {
                sqlCommand.Connection.Open();
                sqlCommand.ExecuteNonQuery();
                sqlCommand.Connection.Close();

                return new JsonResult(Ok($"Table: {additionalFields["CategoryName"]} successfully created"));
            }
            catch(Exception exception)
            {
                return new JsonResult(exception.Message, HttpStatusCode.InternalServerError);
            }

            
        }

        [HttpDelete]
        public JsonResult DeleteTable(Category category)
        {
            SqlConnection connection = new SqlConnection("Server = (LocalDb)\\MSSQLLocalDB; Database=CategoriesDb");
            SqlCommand sqlCommand = new SqlCommand($"DROP TABLE {category.CategoryName}", connection);
            
            try
            {
                sqlCommand.Connection.Open();
                sqlCommand.ExecuteNonQuery();
                sqlCommand.Connection.Close();

                return new JsonResult(Ok($"{category.CategoryName} successfull deleted"));
            }
            catch(Exception exception)
            {
                return new JsonResult(exception.Message, HttpStatusCode.InternalServerError);
            }
        }
    }
}
