<script setup>
import { ref, computed, onMounted } from 'vue';

// Form data
const revenue = ref('');
const formattedRevenue = ref('');
const providerType = ref('MD');
const showResults = ref(false);
const showAssumptions = ref(false);

// Revenue per FTE values (preset but editable)
const mdRevenuePerFTE = ref(550000); // Updated to $550,000 per FTE for MD
const odRevenuePerFTE = ref(275000); // Updated to $275,000 per FTE for OD

// Format a number as currency
const formatAsCurrency = (value) => {
  if (!value) return '';
  
  // Remove any non-digit characters except decimal point
  let numStr = value.toString().replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = numStr.split('.');
  if (parts.length > 2) {
    numStr = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Format with commas for thousands
  if (numStr.includes('.')) {
    const decimalPart = numStr.split('.')[1];
    const wholePart = parseInt(numStr.split('.')[0]).toLocaleString('en-US');
    return `${wholePart}.${decimalPart}`;
  } else {
    return parseInt(numStr || '0').toLocaleString('en-US');
  }
};

// Handle revenue input changes
const updateRevenue = (event) => {
  const rawValue = event.target.value;
  // Store the raw value (for calculations)
  revenue.value = rawValue.replace(/[^\d.]/g, '');
  // Update the formatted display value
  formattedRevenue.value = formatAsCurrency(rawValue);
};

// Array of diverse person emojis - only regular faces with different genders and skin tones
const personEmojis = [
  '👨', '👩', '🧑',                 // Basic faces
  '👨‍🦱', '👩‍🦱', '🧑‍🦱',           // Curly hair
  '👨‍🦰', '👩‍🦰', '🧑‍🦰',           // Red hair
  '👱‍♂️', '👱‍♀️', '👱',             // Blond hair
  '👨‍🦲', '👩‍🦲', '🧑‍🦲',           // Bald
  '👨🏻', '👩🏻', '🧑🏻',             // Light skin tone
  '👨🏼', '👩🏼', '🧑🏼',             // Medium-light skin tone
  '👨🏽', '👩🏽', '🧑🏽',             // Medium skin tone
  '👨🏾', '👩🏾', '🧑🏾',             // Medium-dark skin tone
  '👨🏿', '👩🏿', '🧑🏿'              // Dark skin tone
];

// Generate a shuffled array of emojis to ensure randomness but consistency
const shuffledEmojis = ref([]);

onMounted(() => {
  // Shuffle the emoji array
  shuffleEmojis();
});

// Shuffle the emojis array
const shuffleEmojis = () => {
  shuffledEmojis.value = [...personEmojis]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20); // Limit to 20 emojis for performance
};

// Computed properties
const technicians = computed(() => {
  if (!revenue.value) return 0;
  
  const revValue = parseFloat(revenue.value);
  if (isNaN(revValue)) return 0;
  
  return providerType.value === 'MD' 
    ? revValue / mdRevenuePerFTE.value 
    : revValue / odRevenuePerFTE.value;
});

// Check if technicians exceed the maximum cap
const exceedsMaxTechnicians = computed(() => {
  return technicians.value > 8;
});

// Get display value for technicians (capped at 8+)
const displayTechnicians = computed(() => {
  return exceedsMaxTechnicians.value ? '8+' : technicians.value.toFixed(1);
});

// Get the number of whole technicians to display (maximum 8)
const wholeNumber = computed(() => {
  const value = Math.floor(technicians.value);
  return Math.min(value, 8);
});

// Get the fraction for the partial technician (only if total is <= 8)
const fraction = computed(() => {
  if (exceedsMaxTechnicians.value) {
    return 0; // No partial technician shown when exceeding max
  }
  return technicians.value - Math.floor(technicians.value);
});

// Calculate the staffing
const calculateStaffing = () => {
  console.log('Calculating staffing...');
  console.log('Revenue:', revenue.value);
  console.log('Provider Type:', providerType.value);
  console.log('Technicians:', technicians.value);
  // Shuffle emojis when calculating to get a new random set
  shuffleEmojis();
  showResults.value = true;
};

// Toggle assumptions visibility
const toggleAssumptions = () => {
  showAssumptions.value = !showAssumptions.value;
};

// Format currency
const formatCurrency = (value) => {
  if (!value) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Get an emoji for a specific index
const getEmoji = (index) => {
  return shuffledEmojis.value[index % shuffledEmojis.value.length];
};
</script>

<template>
  <v-app>
    <v-app-bar color="primary" height="72">
      <v-container class="d-flex align-center">
        <v-app-bar-title class="app-title">Provider Staffing Calculator</v-app-bar-title>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="container-fluid">
        <!-- Introduction Section -->
        <v-card class="mb-6" variant="outlined">
          <v-card-text class="py-4">
            <p class="intro-text">Use this calculator to determine the recommended number of technicians based on your practice's yearly revenue projections.</p>
            <p class="mt-2 disclaimer-text">The purpose of this calculator is to provide an estimate and should not be taken as ground truth. Please contact your Director or VP with any questions</p>
          </v-card-text>
        </v-card>

        <!-- Input Form Section -->
        <v-card class="mb-6">
          <v-card-title class="text-h6">Input Your Information</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="calculateStaffing">
              <v-text-field
                v-model="formattedRevenue"
                @input="updateRevenue"
                label="Expected Yearly Revenue"
                prefix="$"
                type="text"
                hint="Enter your projected revenue for the year"
                clearable
                required
                class="responsive-field input-large"
              ></v-text-field>

              <div class="mt-4 mb-2">
                <div class="text-subtitle-1 mb-2">Provider Type</div>
                <v-btn-toggle
                  v-model="providerType"
                  mandatory
                  color="primary"
                  divided
                  class="w-100 responsive-toggle"
                >
                  <v-btn value="MD" class="flex-grow-1">
                    Medical Doctor (MD)
                  </v-btn>
                  <v-btn value="OD" class="flex-grow-1">
                    Optometric Doctor (OD)
                  </v-btn>
                </v-btn-toggle>
              </div>

              <v-btn
                color="primary"
                block
                @click="calculateStaffing"
                :disabled="!revenue"
                class="mt-4"
                type="button"
              >
                Calculate
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Revenue per FTE Assumptions (Collapsible) -->
        <v-card class="mb-6">
          <v-card-title class="text-h6">Revenue Per FTE Assumptions</v-card-title>
          <v-card-text>
            <v-expand-transition>
              <div v-if="showAssumptions">
                <div class="responsive-table-container">
                  <v-table>
                    <thead>
                      <tr>
                        <th>Provider Type</th>
                        <th>Revenue per FTE</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Medical Doctor (MD)</td>
                        <td>
                          <v-text-field
                            v-model="mdRevenuePerFTE"
                            density="compact"
                            hide-details
                            prefix="$"
                            type="number"
                            variant="outlined"
                            class="responsive-field input-large assumption-input"
                          ></v-text-field>
                        </td>
                        <td>Target revenue per technician for Medical Doctors</td>
                      </tr>
                      <tr>
                        <td>Optometric Doctor (OD)</td>
                        <td>
                          <v-text-field
                            v-model="odRevenuePerFTE"
                            density="compact"
                            hide-details
                            prefix="$"
                            type="number"
                            variant="outlined"
                            class="responsive-field input-large assumption-input"
                          ></v-text-field>
                        </td>
                        <td>Target revenue per technician for Optometric Doctors</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </div>
            </v-expand-transition>
            
            <div class="d-flex justify-center mt-4">
              <v-btn
                variant="text"
                color="primary"
                @click="toggleAssumptions"
                class="toggle-btn"
              >
                <span class="toggle-text mr-2">{{ showAssumptions ? '⬆️ Hide assumptions' : '⬇️ View or edit assumptions' }}</span>
                <v-icon>{{ showAssumptions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Results Section -->
        <div v-if="showResults" class="mb-6">
          <v-card color="secondary" variant="outlined">
            <v-card-title class="text-h5">Staffing Results</v-card-title>
            <v-card-text>
              <!-- Results Text -->
              <div class="text-center mb-4">
                <h3 class="text-h6">Calculated Technicians Needed</h3>
                <div class="text-h3 mt-2">{{ displayTechnicians }}</div>
                <div v-if="exceedsMaxTechnicians" class="text-red mt-2 font-weight-medium">
                  Doctors are currently capped at 8 technicians maximum
                </div>
                <div class="text-body-1 mt-2">
                  Based on {{ formatCurrency(revenue) }} yearly revenue for {{ providerType === 'MD' ? 'a Medical' : 'an Optometric' }} Doctor
                </div>
                <div class="text-body-2 mt-1">
                  Using {{ formatCurrency(providerType === 'MD' ? mdRevenuePerFTE : odRevenuePerFTE) }} revenue per FTE
                </div>
              </div>
              
              <!-- Visual Representation -->
              <div class="text-center my-4">
                <div class="d-flex justify-center flex-wrap">
                  <div v-for="i in wholeNumber" :key="i" class="ma-1 person-emoji">
                    {{ getEmoji(i-1) }}
                  </div>
                  <!-- Half technician if needed -->
                  <div v-if="fraction > 0" class="ma-1 person-emoji half-opacity">
                    {{ getEmoji(wholeNumber) }}
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-main>

    <v-footer app></v-footer>
  </v-app>
</template>

<style>
.v-application {
  background-color: #f5f5f5;
}

.w-100 {
  width: 100%;
}

.person-emoji {
  font-size: 40px;
}

.half-opacity {
  opacity: 0.3;
}

.app-title {
  font-size: 2rem;
  line-height: 2.5rem;
  padding: 8px 0;
  font-weight: 500;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
}

.disclaimer-text {
  font-size: 1rem;
  line-height: 1.5;
  font-style: italic;
  color: rgba(0, 0, 0, 0.6);
}

.text-red {
  color: #D32F2F !important;
}

.toggle-btn {
  border-radius: 20px;
  min-width: 200px;
}

.toggle-btn .v-icon {
  font-size: 20px;
}

.toggle-text {
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.0178571429em;
}

/* Input styling */
.input-large input {
  font-size: 1.1rem !important;
  font-weight: 500 !important;
}

.assumption-input input {
  color: rgba(0, 0, 0, 0.6) !important; /* Grayer text color for assumption inputs */
}

.v-field__input {
  font-size: 1.1rem !important;
}

/* Responsive styles */
.container-fluid {
  max-width: 100%;
  padding: 16px;
}

.responsive-field {
  max-width: 100%;
  overflow: hidden;
}

.responsive-toggle {
  max-width: 100%;
  overflow-x: auto;
}

.responsive-table-container {
  width: 100%;
  overflow-x: auto;
}

@media (max-width: 600px) {
  .app-title {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .person-emoji {
    font-size: 32px;
  }

  .intro-text,
  .disclaimer-text {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .input-large input {
    font-size: 1rem !important;
  }
}
</style>
