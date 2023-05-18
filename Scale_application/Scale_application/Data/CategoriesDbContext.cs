using Microsoft.EntityFrameworkCore;
using Scale_application.Models.Entities;

namespace Scale_application.Data
{
    public class CategoriesDbContext : DbContext
    {
        public CategoriesDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
