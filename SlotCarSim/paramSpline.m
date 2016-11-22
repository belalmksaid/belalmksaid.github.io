function [xi yi ti] = paramSpline(x, y, n)
    if ~exist('n', 'var')
        n = 100;
    end
    t = 1:length(x);
    ti = linspace(min(t), max(t), n);
    xi = splint(t, x, ti);
    yi = splint(t, y, ti);
end