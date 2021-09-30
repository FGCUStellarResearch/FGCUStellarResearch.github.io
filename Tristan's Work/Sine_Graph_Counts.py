import numpy as np
import matplotlib.pyplot as plot
import pandas as pd
import ipywidgets as widgets

# Array declaration
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
tempOptions = []

uniqueMass = set();
uniqueTemp = set();

# Get unique values for mass and temperature from table and add it to arrays
table = pd.read_csv('data_segment.txt', header=None, delim_whitespace=True)
for i, row in table.iterrows():
    if row[0] not in uniqueMass or row[1] not in uniqueTemp:
       uniqueMass.add(row[0])
       uniqueTemp.add(row[1])        
uniqueMass = sorted(uniqueMass)

# Event handler for mass dropdown menu
def on_mass_change(change):
    global massVariable
    if change['type'] == 'change' and change['name'] == 'value':
        massVariable = change['new']
        updateTempOptions()  

# Event handler for temperature dropdown menu
def on_temp_change(change):
    global tempVariable
    if change['type'] == 'change' and change['name'] == 'value':
        tempVariable = change['new']
        
# Event handler for submit button
def on_button_submit(b):
    reloadData(massVariable, tempVariable)
    generatePlot()
    
def generatePlot(*args):
    global fig, ax
    fig,ax = plot.subplots()
    
    plot.title("Sine wave")
    plotWave(color="#FF0000", label="220", amp = Amp_220, freq = Freq, phase = Phase_220)
    plotWave(color="#00FF00", label="280", amp = Amp_280, freq = Freq, phase = Phase_280)
    plotWave(color="#0000FF", label="Sloan G", amp = Amp_Sloan_G, freq = Freq, phase = Phase_Sloan_G)

    handles, labels = plot.gca().get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    plot.legend(by_label.values(), by_label.keys())
    leg = ax.legend(by_label.values(), by_label.keys())
    plot.savefig('graph.jpg', bbox_inches='tight')
    plot.show()
    
# Create dropdown menu for selection of mass
massSelected = widgets.Dropdown(
    options=list(uniqueMass),
    description='Mass:',
)

# Create dropdown menu for selection of temperature
tempSelected = widgets.Dropdown(
    description='Temperature:',
)

buttonSubmit = widgets.Button(description="Submit")

massSelected.observe(on_mass_change)
tempSelected.observe(on_temp_change)
buttonSubmit.on_click(on_button_submit)

display(massSelected)      
display(tempSelected)
display(buttonSubmit)    
    
def updateTempOptions(*args):
    tempOptions.clear()
    for i, row in table.iterrows():
        if row[0] == massSelected.value and row[1] in uniqueTemp:
           tempOptions.append(row[1])
    tempSelected.options = sorted(set(tempOptions))
        
# Set default value of checkbox    
massVariable = massSelected.value
updateTempOptions()
tempVariable = tempSelected.value

# Generate time series
time = np.arange(0, 2*np.pi*10, .25);

# Method to plot wave using amplitude, frequency, and phase
def plotWave(color, label, amp = [], freq = [], phase = []):
    
    # Labels and colors
    plot.xlabel('Time (In Days)')
    plot.ylabel('Amplitude = sin(time)')
    plot.grid(True, which='both')
    plot.axhline(y=0, color='black')
    
    # Calculate each filter
    for i in range(len(amp)):
        wave = amp[i]*np.sin(2*np.pi*freq[i]*time+phase[i])
        
        # Plot each filter
        ax.plot(time, wave, color, label=label)

# Method to reload data on change of parameters
def reloadData(massVariable, tempVariable):
    
    global Logg
    global Log_Lum
    global Mode_Degree
    global Mode_Rad_Order
    global Freq
    global Amp_220
    global Phase_220
    global Amp_280
    global Phase_280
    global Amp_Sloan_G
    global Phase_Sloan_G
    
    Logg.clear()
    Log_Lum.clear()
    Mode_Degree.clear()
    Mode_Rad_Order.clear()
    Freq.clear()
    Amp_220.clear()
    Phase_220.clear()
    Amp_280.clear()
    Phase_280.clear()
    Amp_Sloan_G.clear()
    Phase_Sloan_G.clear()
    
    for i, row in table.iterrows():
        if row[0] == massVariable and row[1] == tempVariable:
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