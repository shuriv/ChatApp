using ChatApp.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Добавляем поддержку SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Настраиваем middleware
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

// Подключаем SignalR хаб
app.MapHub<ChatHub>("/chatHub");

app.Run();