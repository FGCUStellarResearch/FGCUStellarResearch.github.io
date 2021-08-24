import numpy as np
import matplotlib.pyplot as plot
import pandas as pd

# Array declaration
Mass = []
Teff = []
Logg = []
Log_Lum = []
Mode_Degree = []
Mode_Rad_Order = []
Freq = []
Amp_220 = []
Phase_220 = []
Amp_280 = []
Phase_280 = []
Amp_Sloan_U = []
Phase_Sloan_U = []
Amp_Sloan_G = []
Phase_Sloan_G = []
Amp_Sloan_T = []
Phase_Sloan_T = []
Amp_Sloan_I = []
Phase_Sloan_I = []

# Counter instantiation
Sum_220 = 0
Sum_280 = 0
Sum_Sloan_U = 0
Sum_Sloan_G = 0
Sum_Sloan_T = 0
Sum_Sloan_I = 0

uniqueMass = set();
uniqueTemp = set();

# Read data from table and add it to arrays
table = pd.read_csv('data_segment.txt', header=None, delim_whitespace=True)
for i, row in table.iterrows():
    if row[0] not in uniqueMass or row[1] not in uniqueTemp:
       uniqueMass.add(row[0])
       uniqueTemp.add(row[1])
       Logg.append(row[2])
       Log_Lum.append(row[3])
       Mode_Degree.append(row[4])
       Mode_Rad_Order.append(row[5])
       Freq.append(row[6])
       Amp_220.append(row[7])
       Phase_220.append(row[8])
       Amp_280.append(row[9])
       Phase_280.append(row[10])
       Amp_Sloan_G.append(row[13])
       Phase_Sloan_G.append(row[14])
      
# Generate time series
time = np.arange(0, 2*np.pi, .25);
fig,ax = plot.subplots()

def plotWavelength(plotTitle, color, label, amp = [], freq = [], phase = []):
    # Labels and colors
    plot.title(plotTitle)
    plot.xlabel('Time (In Days)')
    plot.ylabel('Amplitude = sin(time)')
    plot.grid(True, which='both')
    plot.axhline(y=0, color='black')
    
    # Calculate each filter
    for i in range(len(uniqueTemp)):
        wave = amp[i]*np.sin(2*np.pi*freq[i]*time+phase[i])
        
        # Plot each filter
        ax.plot(time, wave, color, label=label)
        
plotWavelength(plotTitle = "Sine wave (220)", color="#FF0000", label="220", amp = Amp_220, freq = Freq, phase = Phase_220)
plotWavelength(plotTitle = "Sine wave (280)", color="#00FF00", label="280", amp = Amp_280, freq = Freq, phase = Phase_280)
plotWavelength(plotTitle = "Sine wave (Sloan G)", color="#0000FF", label="Sloan G", amp = Amp_Sloan_G, freq = Freq, phase = Phase_Sloan_G)

handles, labels = plot.gca().get_legend_handles_labels()
by_label = dict(zip(labels, handles))
plot.legend(by_label.values(), by_label.keys())
leg = ax.legend(by_label.values(), by_label.keys())
plot.show()