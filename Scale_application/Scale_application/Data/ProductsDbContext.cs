using Microsoft.EntityFrameworkCore;
using Scale_application.Models.Entities;

namespace Scale_application.Data
{
    public class ProductsDbContext : DbContext
    {
        public ProductsDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
    }
}
