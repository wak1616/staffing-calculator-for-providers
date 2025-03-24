<script setup>
import { ref, computed, onMounted } from 'vue';

// Form data
const revenue = ref('');
const formattedRevenue = ref('');
const providerType = ref('Cataract MD');
const showResults = ref(false);
const showAssumptions = ref(false);

// Revenue per FTE values (preset but editable)
const mdRevenuePerFTE = ref('550000'); // Updated to $550,000 per FTE for cataract MD
const formattedMdRevenuePerFTE = ref('550,000');
const odRevenuePerFTE = ref('275000'); // Updated to $275,000 per FTE for OD
const formattedOdRevenuePerFTE = ref('275,000');
const retinaMdRevenuePerFTE = ref('325000'); // $325,000 per FTE for Retina or other MD
const formattedRetinaMdRevenuePerFTE = ref('325,000');

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

// Handle revenue per FTE input changes
const updateRevenuePerFTE = (event, ref, formattedRef) => {
  const rawValue = event.target.value;
  // Store the raw value (for calculations)
  ref.value = rawValue.replace(/[^\d.]/g, '');
  // Update the formatted display value
  formattedRef.value = formatAsCurrency(rawValue);
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

const toggleRef = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

onMounted(() => {
  // Shuffle the emoji array
  shuffleEmojis();
  
  // Add scroll listener
  const container = toggleRef.value?.$el;
  if (container) {
    container.addEventListener('scroll', checkScroll);
    // Initial check
    checkScroll();
  }
});

// Shuffle the emojis array
const shuffleEmojis = () => {
  shuffledEmojis.value = [...personEmojis]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20); // Limit to 20 emojis for performance
};

// Add scroll functions
const scrollToggleLeft = () => {
  const container = toggleRef.value?.$el;
  if (!container) return;
  container.scrollBy({
    left: -200,
    behavior: 'smooth'
  });
};

const scrollToggleRight = () => {
  const container = toggleRef.value?.$el;
  if (!container) return;
  container.scrollBy({
    left: 200,
    behavior: 'smooth'
  });
};

// Check scroll position
const checkScroll = () => {
  const container = toggleRef.value?.$el;
  if (!container) return;
  
  canScrollLeft.value = container.scrollLeft > 0;
  canScrollRight.value = container.scrollLeft < (container.scrollWidth - container.clientWidth);
};

// Computed properties
const technicians = computed(() => {
  if (!revenue.value) return 0;
  
  const revValue = parseFloat(revenue.value);
  if (isNaN(revValue)) return 0;
  
  if (providerType.value === 'Cataract MD') {
    return revValue / parseFloat(mdRevenuePerFTE.value);
  } else if (providerType.value === 'Retina MD') {
    return revValue / parseFloat(retinaMdRevenuePerFTE.value);
  } else {
    return revValue / parseFloat(odRevenuePerFTE.value);
  }
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
            <p class="intro-text">Use this calculator to estimate number of technicians based on your practice's yearly revenue projections.</p>
            <p class="mt-2 disclaimer-text"><strong>Disclaimer:</strong> This calculator is intended for a full-time physician defined as working 32 or more hours of direct patient care per week. Physicians with reduced clinical hours should be evaluated on a case-by-case basis.</p>
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
                <div class="provider-scroll-container">
                  <v-btn-toggle
                    v-model="providerType"
                    mandatory
                    color="primary"
                    divided
                    class="provider-toggle"
                    ref="toggleRef"
                  >
                    <v-btn value="Cataract MD" class="flex-grow-1">
                      Cataract Surgeon
                    </v-btn>
                    <v-btn value="Retina MD" class="flex-grow-1">
                      Retina or Other MD
                    </v-btn>
                    <v-btn value="OD" class="flex-grow-1">
                      Optometrist
                    </v-btn>
                  </v-btn-toggle>
                  <div class="scroll-indicators">
                    <v-icon
                      :icon="canScrollLeft ? 'mdi-chevron-left' : 'mdi-circle-small'"
                      :color="canScrollLeft ? 'primary' : 'grey-lighten-2'"
                      size="24"
                      class="scroll-indicator"
                    ></v-icon>
                    <v-icon
                      :icon="canScrollRight ? 'mdi-chevron-right' : 'mdi-circle-small'"
                      :color="canScrollRight ? 'primary' : 'grey-lighten-2'"
                      size="24"
                      class="scroll-indicator"
                    ></v-icon>
                  </div>
                </div>
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cataract surgeon (MD)</td>
                        <td>
                          <v-text-field
                            v-model="formattedMdRevenuePerFTE"
                            @input="(e) => updateRevenuePerFTE(e, mdRevenuePerFTE, formattedMdRevenuePerFTE)"
                            density="compact"
                            hide-details
                            prefix="$"
                            type="text"
                            variant="outlined"
                            class="responsive-field input-large assumption-input"
                          ></v-text-field>
                        </td>
                      </tr>
                      <tr>
                        <td>Retina or other ophthalmologist (MD)</td>
                        <td>
                          <v-text-field
                            v-model="formattedRetinaMdRevenuePerFTE"
                            @input="(e) => updateRevenuePerFTE(e, retinaMdRevenuePerFTE, formattedRetinaMdRevenuePerFTE)"
                            density="compact"
                            hide-details
                            prefix="$"
                            type="text"
                            variant="outlined"
                            class="responsive-field input-large assumption-input"
                          ></v-text-field>
                        </td>
                      </tr>
                      <tr>
                        <td>Doctor of optometry (OD)</td>
                        <td>
                          <v-text-field
                            v-model="formattedOdRevenuePerFTE"
                            @input="(e) => updateRevenuePerFTE(e, odRevenuePerFTE, formattedOdRevenuePerFTE)"
                            density="compact"
                            hide-details
                            prefix="$"
                            type="text"
                            variant="outlined"
                            class="responsive-field input-large assumption-input"
                          ></v-text-field>
                        </td>
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
                  Physicians are currently capped at 8 technicians maximum
                </div>
                <div class="text-body-1 mt-2">
                  Based on {{ formatCurrency(revenue) }} expected yearly revenue for 
                  {{ providerType === 'Cataract MD' 
                    ? 'a cataract MD' 
                    : providerType === 'Retina MD' 
                      ? 'a retina specialist or other ophthalmologist' 
                      : 'an optometric doctor' }} 
                </div>
                <div class="text-body-2 mt-1">
                  Using {{ formatCurrency(
                    providerType === 'Cataract MD' 
                      ? mdRevenuePerFTE 
                      : providerType === 'Retina MD' 
                        ? retinaMdRevenuePerFTE 
                        : odRevenuePerFTE) }} revenue per FTE
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

.provider-scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.provider-toggle {
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  padding: 4px 0;
}

.provider-toggle::-webkit-scrollbar {
  display: none;
}

.scroll-indicators {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  padding: 0 8px;
}

.scroll-indicator {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scroll-indicator:hover {
  background-color: rgba(255, 255, 255, 1);
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
  
  .scroll-indicators {
    padding: 0 4px;
  }
}

@media (min-width: 601px) {
  .scroll-indicators {
    display: none;
  }
}
</style>
