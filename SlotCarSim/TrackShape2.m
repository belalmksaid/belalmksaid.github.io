t = 0:(2*pi/400):(2*pi);

xi = (2 + cos(3.*t)).*cos(t);
yi = (2 + cos(3.*t)).*sin(t);
xi = xi - ((max(xi) + min(xi))/2.0);
yi = yi - ((max(yi) + min(yi))/2.0);
xi = xi ./ max(xi);
yi = yi ./ max(yi);

plot(xi, yi, '.');
axis equal

fileID = fopen('track2.txt','w');
fprintf(fileID, '%f,%f|', [xi yi]');
fclose(fileID);