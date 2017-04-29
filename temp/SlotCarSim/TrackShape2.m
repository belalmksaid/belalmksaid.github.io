t = (2*pi):(-2*pi/400):0;

xi = (2 + cos(3.*t)).*cos(t);
yi = (2 + cos(3.*t)).*sin(t);
xi = xi - ((max(xi) + min(xi))/2.0);
yi = yi - ((max(yi) + min(yi))/2.0);
x = xi ./ max(xi);
y = yi ./ max(yi);

plot(x, y, '.');
axis equal

fileID = fopen('track4.txt','w');
fprintf(fileID, '%f,%f|', [x y]');
fclose(fileID);