function [per, freq,tr1,tr2,FluxInTr,FluxOutTr,Tmid,InTr] = OptimalBLS(jd,m,dm,varargin)
%function [per, freq,tr1,tr2,FluxInTr,FluxOutTr,Tmid,InTr] = OptimalBLS(jd,m,dm,varargin)
% v.1.01    - added frequency-only output: (see: jd-only input)
%           - corrected logic of group-analysis
% ---------------------------------------------------------
% An optimal implimentation of the BLS algorithm (Kovacs, Zucker and Mazeh 2002) as described in Ofir (2013).
%
% One can input only the light curve(s) (i.e.: only jd,m,dm) or specify any or none of the optional parameters
% Specifically, the searched frequencies are also given as the second output. This procedure can be also used to give 
% very perliminary description of the best fitting signal (see OUTPUTS section).
%
% INPUTS:
% required parameters:
%    jd [d] - A column of time values in *days* (units are important to correctly calculate the duty cycle q)
%             Note a special mode exists: if ONLY jd is given (i.e.: both [m],[dm] are given empty) then Optimal BLS is NOT calculated (per returns empty) but the frequencies supposed to be used (freq output) are returned. All other optional parameters still apply.
%    m      - Either a column vector in the same size of jd or a matrix with several such columns (for group-of-stars evaluation).
%             The values should be in differencial magnitude or reltive flux decrement (i.e., transit = small positive value)
%    dm     - Same size as m, and containing the magnitude error (or: reltive flux error).
% optional parameters:
%    fmin [d^-1]  - force the minimum orbital frequency to be different than the default 2/(data span)
%    fmax [d^-1]  - Force the maximum orbital frequency to be different than the one given on Ofir (2013). Also related to ClosestOrbit.
%    freq [d^-1]  - A vecor. force particular values the seached frequencies.
%    OverSampling or OS - Frequency oversampling beyond the critical sampling
%    ClosestOrbit - Related to fmax. Used to force the maximum orbital frequency to be different than the one derived from 3 stellar radii.
%    Qmin         - force the relative minimum searched duty cycle to be different than the default 3.
%    Qmax         - force the relative maximum searched duty cycle to be different than the default 3.
%    MinBin       - force the relative smallest bin size used to be different than the default 3.
%    M            - Mass of host star [Solar units, default=Sun]
%    R            - Radius of host star [Solar units, default=Sun]
%    FreqPol      - boolean. If false [default] then outputs the frequency values. If true, outputs the a vector with the 4 polynomal coefficients for freq.
%                   importantly, the polynomial given by the coefficients  is given in [s^-1]. To change to [cycle day^-1] one nees to multiply the resultant values by (60*60*24) (sec. in a day).
%    FileName     - If given, saves outputs to the disk on the given FileName.
%                   The outputs saved are either just two [per, freq] or all possible outputs - depending on the output mode (below)
%
% OUTPUTS
% The procedure has two modes:
%   - if input 'freq' is skipped (VECTOR computed internally), or if a a VECTOR is given by the user, then:
%     the outputs will be *only* the BLS periodogram per at frequencies freq.
%   - if input 'freq' is given by the user as a SCALAR, then this freq is understood to be special (e.g., best-fitting) and 
%     this procedure can be used to describe the best-fitting signal at this freq -- and a single input light curve is also required (i.e., not multiple). 
%     Only then are the other outputs given. The additional information given is: 
%     tr1,tr2:   the phases of the start and end of the transit
%     FluxInTr:  best-fitting low level of the box (should be a positive number)
%     FluxOutTr: best-fitting high level of the box (should be a small negative number)
%                box depth is FluxInTr-FluxOutTr
%     Tmid:      suggested reference epoch: the trasit with the highest number of data points in-transit (first of them, if several equal exist)
%     InTr:      a logical vector the length of the number of input data points that is true if a data point is in-transit.
%
%
%
%  Written by:  Aviv Ofir (12/2012).
%               avivofir@astro.physik.uni-goettingen.de 
%  Last update: 7/2013
%  Please cite: Ofir (2014), A&A vol. 561 p. 138
%
HardMinBin=1;   % Minimal number of in-transit points on the foldeed light curve
FreqOnlyOutput=false;

% CONSTANTS
G=6.67384e-11;      % [m^3 kg^-1 s^-2]
SecInDay=60*60*24;  % number of seconds in one day
Msun=1.9891e30;     % [kg]
Rsun=696342e3;      % [m]

% INPUT CONTROL
if nargin<3
    fprintf('ERROR: not enough inputs. Please specify jd, m, dm.\n')
    per=[]; freq=[];
    return;
end
if ~isempty(jd) && isempty(m) && isempty(dm)
   FreqOnlyOutput=true; 
end
if size(jd,1)==1
    jd=jd.';
end;
if size(m,1)==1 && ~FreqOnlyOutput
    m=m.';
end;
if size(dm,1)==1 && ~FreqOnlyOutput
    dm=dm.';
end;
if size(jd,2)>1
    fprintf('ERROR: input jd should be a column vector\n')
    per=[]; freq=[];
    return;
end;
if any(~isreal(jd))
    fprintf('ERROR: input jd vector should include only real values.\n')
    per=[]; freq=[];
    return;
end;
if size(m,1)~=size(jd,1) && ~FreqOnlyOutput
    fprintf('ERROR: number of column elements in m and jd does not match.\n')
    per=[]; freq=[];
    return;
end;
if any(~isreal(m(:))) && ~FreqOnlyOutput
    fprintf('ERROR: input m should include only real values.\n')
    per=[]; freq=[];
    return;
end;
if any(size(m)-size(dm)) && ~FreqOnlyOutput
    fprintf('ERROR: size of m and dm does not match.\n')
    per=[]; freq=[];
    return;
end;
if any(~isreal(dm(:))) || any(dm(:)<=0) && ~FreqOnlyOutput
    fprintf('ERROR: input dm should include positive real values.\n')
    per=[]; freq=[];
    return;
end;
for i=2:2:numel(varargin)
    if any(~isreal(varargin{i}(:)) | varargin{i}(:)<0)
        fprintf('ERROR: all parameter values should be non-zero real numbers.\n')
        per=[]; freq=[];
        return;
    end;
end;

if FreqOnlyOutput
    good=isfinite(jd);
    jd = jd(good)'*SecInDay;
else
    good=isfinite(jd) & all(isfinite(m),2) & all(isfinite(dm),2) & all(dm,2)~=0;
    jd = jd(good)'*SecInDay;
    m = m(good,:)';
    dm = dm(good,:)';
    w = 1./dm.^2;
end;

% DEFAULT VALUES FOR PARAMETERS
freq=[];
span=max(jd)-min(jd);
M=Msun;            % [M sun]
R=Rsun;            % [R sun]
fmin=2/span;       % [s ^-1]
ClosestOrbit=3;    % [Rstar]
OverSampling=3;
Qmin=3;
Qmax=3;
MinBin=3;
fmax=[];
FileName=[];
FreqPol=false;
for i=1:2:numel(varargin)
    switch lower(varargin{i})
        case 'fmin'
            if ~isempty(varargin{i+1})
                fmin=varargin{i+1};
                fmin=fmin/SecInDay;
            end;
        case 'fmax'
            if ~isempty(varargin{i+1})
                fmax=varargin{i+1};
                fmax=fmax/SecInDay;
            end;
        case 'freq'
            freq=varargin{i+1}/SecInDay;
        case {'oversampling','os'}
            OverSampling=varargin{i+1};
        case 'm'
            M=varargin{i+1};
            M=M*Msun;
        case 'r'
            R=varargin{i+1};
            R=R*Rsun;
        case 'closestorbit'
            ClosestOrbit=varargin{i+1};
        case 'qmin'
            Qmin=varargin{i+1};
        case 'qmax'
            Qmax=varargin{i+1};
        case 'minbin'
            MinBin=varargin{i+1};
        case 'freqpol'
            FreqPol=varargin{i+1};
        case 'filename'
            FileName=varargin{i+1};
        otherwise
            fprintf('WARNING: unknown parameter "%s" ignored.\n',varargin{i});
    end;
end;
if isempty(fmax)
    fmax=1/(2*pi)*sqrt(G*M/(R*ClosestOrbit)^3);
end;

q=@(f,M,R) (2*pi)^(2/3)/pi*R/(G*M)^(1/3)*f.^(2/3);  % duty cycle function
A=(2*pi)^(2/3)/pi*R/(G*M)^(1/3)/span/OverSampling;
if isempty(freq)
    x=1:(fmax^(1/3)-fmin^(1/3)+A/3)*3/A;
    freq=(A/3*x+fmin^(1/3)-A/3).^3;
elseif numel(freq)==1
    if size(m,1)>1
        fprintf('ERROR: one freq value given for multiple stars. Cannot describe multiple stars simultaneously.\n')
        per=[]; freq=[];
        return;
    end;
end;
if FreqOnlyOutput
    per=[];
    return;
end;

if FreqPol
    FreqPol=zeros(1,4,'double');
    FreqPol(1)=(A/3)^3;
    FreqPol(2)=3*(A/3)^2*(fmin^(1/3)-A/3);
    FreqPol(3)=A*(fmin^(1/3)-A/3)^2;
    FreqPol(4)=(fmin^(1/3)-A/3)^3;
end;
qvec=round(q(freq,M,R)/Qmin/MinBin * numel(jd));
PointsInMinBin = max(HardMinBin,qvec);
NumBins = round(Qmin*Qmax);


% The core calculation
% --------------------
% Trying to avoid Matlab loops, the code loopless excpet for frequency - but more difficult to follow.
% The general idea is to compute cumulative sums on the phase-sorted data, and then differences between different indices along these cumulative sums will be the sume just between these indices.
% Main parameter:  Ind_mat - indices where bins start/end
%                  sw      - cumulative sum of weights
%                  swm     - cumulative sum of weighted mean
%                  wbin, wmbin   - weights and weighted mean at the bin edges
%                  when "s" is added to these names it means the total sum (the last entry of the cumulative sum)
%                  mtr     - mean in-transit
%                  mxtr    - mean out-of-transit
% Some of the parameters are three-dimentional cubes. Along axis 1: Different MinBin offsetes, for the longer-than transits. similar to Edge Effect correction to the original BLS.
%                                                     Along axis 2: different reference phase
%                                                     Along axis 3: different stars in the group

n = length(jd);
if numel(freq)>1
    per=[];
    parfor i=1:numel(freq)
        % build matrix of indices, where relevant quantities will be calculated
        Ibin = PointsInMinBin(i):PointsInMinBin(i):n;
        if Ibin(end)~=n
            Ibin = [Ibin n];
        end

        Ind_mat=zeros(NumBins,length(Ibin)+NumBins);
        Ind_mat(1,:)=1:(length(Ibin)+NumBins);
        for j=2:NumBins  
            Ind_mat(j,:) = [Ind_mat(1,j:end) Ind_mat(1:j-1)]; 
        end
        
        % phase folding
        ph = jd*freq(i);
        ph = ph-floor(ph);
        [~, Iph] = sort(ph);

        sw = cumsum(w(:,Iph),2);
        swt = sw(:,end);
        swm = cumsum(w(:,Iph).*m(:,Iph),2);
        swmt = swm(:,end);

        wmbin = swm(:,Ibin);
        wmbin = wmbin - [zeros(size(wmbin,1),1)  wmbin(:,1:end-1)];
        wmbin_maxbins = [wmbin wmbin(:,1:NumBins)];
        all_wmbin=cumsum(reshape(wmbin_maxbins(:,Ind_mat).',size(Ind_mat,1),size(Ind_mat,2),[]));

        wbin = sw(:,Ibin);
        wbin = wbin - [zeros(size(wbin,1),1) wbin(:,1:end-1)];
        wbin_maxbins = [wbin wbin(:,1:NumBins)];
        all_wbin=cumsum(reshape(wbin_maxbins(:,Ind_mat).',size(Ind_mat,1),size(Ind_mat,2),[]));

        % inlining repmat: 
        swmt=reshape(swmt,1,1,numel(swmt));
        tmp={ones(1,size(all_wmbin,1)),ones(1,size(all_wmbin,2)),(1:numel(swmt)).'};
        swmt=swmt(tmp{:});
        swt=reshape(swt,1,1,numel(swt));
        swt=swt(tmp{:});

        mxtr = (swmt-all_wmbin)./(swt-all_wbin);
        mtr = all_wmbin./all_wbin;
        
        mtr=reshape(mtr,[],size(mtr,3));
        mxtr=reshape(mxtr,[],size(mxtr,3));
        swt=reshape(swt,[],size(swt,3));
        all_wbin=reshape(all_wbin,[],size(all_wbin,3));
        [~, ind]=max(mtr.*all_wbin-mxtr.*(swt-all_wbin));
        ind=sub2ind(size(mtr),ind,1:numel(ind));
        per(i,:)=2*(mtr(ind).*all_wmbin(ind)+mxtr(ind).*(swmt(ind)-all_wmbin(ind)))-mtr(ind).^2.*all_wbin(ind)-mxtr(ind).^2.*(swt(ind)-all_wbin(ind));
    end
else
    Ibin = PointsInMinBin:PointsInMinBin:n;
    if Ibin(end)~=n
      Ibin = [Ibin n];
    end
    Ind_mat=zeros(NumBins,length(Ibin)+NumBins);
    Ind_mat(1,:)=1:(length(Ibin)+NumBins);
    for j=2:NumBins  
      Ind_mat(j,:) = [Ind_mat(1,j:end) Ind_mat(1:j-1)]; 
    end
    [chi2, mtr, mxtr]=OneFreq(freq,jd,m,w,Ibin,NumBins,Ind_mat);
    per = max(max(chi2));    
    if nargout>1
        ph = jd*freq;
        ph = ph-floor(ph);
        [ph, Iph] = sort(ph);
        
        [r, c] = find(chi2==per);
        r = r(1);
        c = c(1);
        c1 = c+r;
        FluxInTr = mtr(r,c);
        FluxOutTr = mxtr(r,c);
        if c>length(Ibin)
          c = c-length(Ibin);
        end
        tr1 = ph(Ibin(c)-PointsInMinBin+1);
        if c1>length(Ibin)
          c1 = c1-length(Ibin);
        end    
        tr2 = ph(Ibin(c1));
        if c<c1
          Itr = (Ibin(c)-PointsInMinBin+1):Ibin(c1);
        else
          Itr = [1:Ibin(c1) (Ibin(c)-PointsInMinBin+1):length(ph)];
        end
        InTr=false(size(jd));  % boolean - true of point is in transit
        InTr(Iph(Itr))=true;
        jdtr = sort(jd(Iph(Itr)));
        HalfPeriodDifference=1/freq/2;
        NewEvent=diff(jdtr)>HalfPeriodDifference;
        if NewEvent(end)==numel(jdtr) % last point in the dataset is the first point in a new transit event
            NInTr=[NInTr 1];
        end;
        
        EventNumber=NaN(size(jd));
        EventNumber(InTr)=floor(jd(InTr)*freq);
        tmp=(min(EventNumber):max(EventNumber)).'; % tmp=[EventNumber PointsInevent]
        for i=min(EventNumber):max(EventNumber)
            tmp(tmp(:,1)==i,2)=sum(EventNumber==i);
        end;
        Tmid=tmp(find(tmp(:,2)==max(tmp(:,2)),1),1);  % Tmid is now the reference event number (an integer)
        
        if tr2>tr1
            Tmid=(Tmid+(tr1+tr2)/2)/freq/SecInDay;
        else
            Tmid=((Tmid-1)+(tr1-1+tr2)/2)/freq/SecInDay;
        end;
    end;
end
if islogical(FreqPol) && FreqPol==false
    freq=freq*SecInDay;
else
    freq=FreqPol;
end;

if ~isempty(FileName)
    if numel(freq)>1
	save(FileName,'per','freq');
    else
	save(FileName,'per', 'freq','tr1','tr2','FluxInTr','FluxOutTr','Tmid','InTr');
    end
    fprintf('Saved output to disk,\n')
end

% This function operates on just a single star, unlike
function [chi2, mtr, mxtr]=OneFreq(freq,jd,m,w,Ibin,max_bin,Ind_mat)
    ph = jd*freq;
    ph = ph-floor(ph);
    [~, Iph] = sort(ph);

    sw = cumsum(w(:,Iph),2);
    swt = sw(:,end);
    swm = cumsum(w(:,Iph).*m(:,Iph),2);
    swmt = swm(:,end);

    wmbin = swm(:,Ibin);
    wmbin = wmbin - [zeros(size(wmbin,1),1)  wmbin(:,1:end-1)];
    wmbin = [wmbin wmbin(:,1:max_bin)];
    all_wmbin=zeros(size(Ind_mat,1),size(Ind_mat,2),size(wmbin,1));
    for i=1:size(wmbin,1)
        tmp=wmbin(i,:);
        all_wmbin(:,:,i) = cumsum(tmp(Ind_mat),1);
    end;

    wbin = sw(:,Ibin);
    wbin = wbin - [zeros(size(wbin,1),1) wbin(:,1:end-1)];
    wbin = [wbin wbin(:,1:max_bin)];
    all_wbin=zeros(size(Ind_mat,1),size(Ind_mat,2),size(wbin,1));
    for i=1:size(wbin,1)
        tmp=wbin(i,:);
        all_wbin(:,:,i) = cumsum(tmp(Ind_mat),1);
    end;

    swmt=repmat(reshape(swmt,1,1,numel(swmt)),size(all_wmbin,1),size(all_wmbin,2));
    swt=repmat(reshape(swt,1,1,numel(swt)),size(all_wbin,1),size(all_wbin,2));
    mxtr = (swmt-all_wmbin)./(swt-all_wbin);
    mtr = all_wmbin./all_wbin;
    mtr = max(mtr,mxtr);
    chi2 = 2*mtr.*all_wmbin+2*mxtr.*(swmt-all_wmbin)-mtr.^2.*all_wbin-mxtr.^2.*(swt-all_wbin);