r = 0:(2*pi/100):(2*pi);
x = [-1 -0.5 0 0.5 1 0.5 0 -0.5 -1];
y = [0 1 0.5 1 0 -1 -0.5 -1 0];
n = 400;
[xi, yi, tk] = paramSpline(x, y, n);

plot(xi, yi, '.');
axis([-2 2 -2 2])
axis equal

fileID = fopen('track.txt','w');
fprintf(fileID, '%f,%f|', [xi yi]');
fclose(fileID);